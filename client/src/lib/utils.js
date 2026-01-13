import { toast } from 'react-hot-toast';

export const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

export const shareContent = async ({ title, text, url }) => {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
                toast.error('Failed to share');
            }
        }
    } else {
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        } catch (error) {
            console.error('Error copying:', error);
            toast.error('Failed to copy link');
        }
    }
};
