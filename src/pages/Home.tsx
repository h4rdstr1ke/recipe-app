type HomeProps = {
    searchQuery: string;
};

export default function Home({ searchQuery }: HomeProps) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Главная страница</h1>
            <p>Вы ищете: {searchQuery}</p>
        </div>
    );
}