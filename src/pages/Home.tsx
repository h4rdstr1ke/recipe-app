import Feed from '../features/feed/Feed';
//import Helper from '../components/helperAI/Helper'
/*import { Link } from 'react-router-dom'; */

export default function Home() {
    return (
        <div className=''>
            {/* 
            <div className='flex flex-col'>
                <Link to="/PostEdit" >PostEdit</Link>
                <></>
                <Link to="/PostCreate" >PostCreate</Link>
            </div> */} {/* Временно */}
            <Feed />
            {/*<Helper />*/}
        </div>
    );
}