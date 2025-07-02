import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getIdea } from '@/services/idea-service';
import type { IdeaDetail } from '@/types/idea';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const useIdeaDetails = (ideaId: string, isAuthenticated: boolean, authLoading: boolean) => {
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchIdeaDetails = async () => {
      if (!ideaId || authLoading) return;
      
      if (!isAuthenticated) {
        return;
      }
      
      setLoading(true);
      try {
        const ideaData = await getIdea(ideaId);
        setIdea({
          _id: ideaData.task_id,
          ...ideaData,
        } as IdeaDetail);
        setLoading(false);

        if (ideaData.status === "PENDING" || ideaData.status === "PROCESSING") {
          const sse = new EventSource(`${API_URL}/ideatask/events/${ideaId}`);
          
          sse.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setIdea(data);
            
            if (data.status === "completed" || data.status === "failed") {
              sse.close();
            }
          };
          
          sse.onerror = () => {
            sse.close();
          };
          
          setEventSource(sse);
        }
      } catch (err) {
        console.error("Error fetching idea details:", err);
        const error = err as any;
        
        if (error.response?.status === 404) {
          setError(`Idea not found. (ID: ${ideaId})`);
        } else if (error.response?.status === 401) {
          router.push("/login");
        } else {
          setError(`Failed to load idea details. Error: ${error.message || "Unknown error"}`);
        }
        setLoading(false);
      }
    };

    fetchIdeaDetails();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [ideaId, isAuthenticated, authLoading, router, eventSource]);

  return { idea, loading, error, setIdea };
}; 