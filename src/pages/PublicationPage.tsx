import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePostStore, type Post } from '../stores/postStore';
import { useUserSettingsStore } from '../stores/userSettingsStore';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';

import Arrow from '../assets/arrow.svg?react'

import PublicationFull from '../features/publication/PublicationFull';

export default function PublicationPage() {
    const { id } = useParams<{ id: string }>();
    const { fetchPostById, isLoading: storeLoading } = usePostStore();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();
    const { fetchSettings } = useUserSettingsStore();

    const handleMouseDown = () => { }
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
                <Link to="/">
                    <button className='flex items-center justify-center gap-2 border-[1px] rounded-[37px] w-[152px] h-[28px] border-[#23A6F0]' onMouseDown={handleMouseDown}>
                        <Arrow className='rotate-180' />
                        <span className='font-montserrat text-[14px] text-[#23A6F0] tracking-[0.2px] leading-7 font-bold'>К рецептам</span>
                    </button>
                </Link>
                <PublicationFull post={post} />
            </div>
        </div >);
}