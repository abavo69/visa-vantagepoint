import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Services from '@/components/Services';

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Services />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
