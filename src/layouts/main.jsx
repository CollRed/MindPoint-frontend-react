import Header from '../components/header/header.jsx';
import Footer from '../components/footer/footer.jsx';
import "./layout.css";

export default function MainLayout({ children }) {
    return (
        <div className="page-wrapper">
            <Header />
            <main className="page-content">{children}</main>
            <Footer />
        </div>
    );
}
