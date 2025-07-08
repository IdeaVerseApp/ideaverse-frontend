import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getIdea } from '@/services/idea-service';
import type { IdeaDetail } from '@/types/idea';

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const useIdeaDetails = (ideaId: string, isAuthenticated: boolean, authLoading: boolean) => {
  const [idea, setIdea] = useState<IdeaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const router = useRouter();

  useEffect(() => {
    let currentEventSource: EventSource | null = null;
    
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
          currentEventSource = new EventSource(`${API_URL}/api/v1/ideatask/events/${ideaId}`);
          
          currentEventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setIdea(data);
            
            if (data.status === "completed" || data.status === "failed") {
              currentEventSource?.close();
              setEventSource(null);
            }
          };
          
          currentEventSource.onerror = () => {
            currentEventSource?.close();
            setEventSource(null);
          };
          
          setEventSource(currentEventSource);
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
      if (currentEventSource) {
        currentEventSource.close();
        currentEventSource = null;
      }
      if (eventSource) {
        eventSource.close();
        setEventSource(null);
      }
    };
  }, [ideaId, isAuthenticated, authLoading, router]);

  return { idea, loading, error, setIdea };
}; 