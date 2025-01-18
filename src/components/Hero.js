import NavBar from '../components/Navbar/NavBar';
import { useTranslation } from 'react-i18next';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className="hero flex justify-center items-center" id='hero'>
                <div>
                    <NavBar />
                </div>
            </div>

        </>
    )
}

export default Hero;