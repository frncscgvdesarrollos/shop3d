// Suggested code may be subject to a license. Learn more: ~LicenseLog:3256483355.
export default function Footer() {
    return (
        <footer className="bg-blue-900 text-white py-4 text-center">
            {/* <p>Shop3D. Emprendimiento en desarrollo .</p>
            <p>Un hobby y una pasion.</p> */}
            <div className="flex justify-center gap-4 mt-4 text-xl font-bold my-10">
                <p>Redes:</p>
                <ul className="list-unstyled flex justify-center gap-4">
                    <li><a href="https://www.facebook.com/shop3d" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                    <li><a href="https://www.instagram.com/shop3d" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    <li><a href="https://twitter.com/shop3d" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                    <li><a href="https://www.youtube.com/channel/UC3256483355" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                </ul>
            </div>
        </footer>
    )
}