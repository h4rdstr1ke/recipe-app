import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePostStore, type Post } from '../stores/postStore';
import { useUserSettingsStore } from '../stores/userSettingsStore';
import { useAuthStore } from '../stores/authStore';

import ButtonBackRecipes from '../components/button/ButtonBackRecipes';
import PublicationFull from '../features/publication/PublicationFull';

export default function PublicationPage() {
    const { id } = useParams<{ id: string }>();
    const { fetchPostById, isLoading: storeLoading } = usePostStore();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();
    const { fetchSettings } = useUserSettingsStore();

    //    const handleMouseDown = () => { }
    useEffect(() => {
        if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated, fetchSettings]);
    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const loadPost = async () => {
            setLoading(true);
            const foundPost = await fetchPostById(id);
            setPost(foundPost);
            setLoading(false);
        };

        loadPost();
    }, [id, fetchPostById]);

    if (loading || storeLoading) {
        return (<div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#23A6F0]"></div>
        </div>);
    }

    if (!post) {
        return <div>Публикация не найдена</div>;
    }

    return (
        <div className='flex justify-center'>
            <div className='flex flex-col w-[900px] mt-4 gap-2'>
                <ButtonBackRecipes />
                <PublicationFull post={post} />
            </div>
        </div >);
}