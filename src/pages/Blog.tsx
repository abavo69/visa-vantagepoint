import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Blog = () => {
  const { language } = useLanguage();

  const texts = {
    en: {
      title: 'Visa & Immigration Blog',
      description: 'Stay updated with the latest visa news, tips, and guides',
      posts: [
        {
          title: 'Top 10 Countries with Easy Visa Process in 2024',
          excerpt: 'Discover which countries offer the simplest and fastest visa application processes for tourists and business travelers.',
          author: 'Danova Team',
          date: 'Nov 20, 2025',
          readTime: '5 min read',
          category: 'Travel Tips'
        },
        {
          title: 'Student Visa Requirements: Complete Guide',
          excerpt: 'Everything you need to know about applying for a student visa, from documentation to interview preparation.',
          author: 'Immigration Expert',
          date: 'Nov 18, 2025',
          readTime: '8 min read',
          category: 'Student Visa'
        },
        {
          title: 'Work Visa vs Business Visa: What\'s the Difference?',
          excerpt: 'Understanding the key differences between work and business visas to choose the right option for your needs.',
          author: 'Visa Consultant',
          date: 'Nov 15, 2025',
          readTime: '6 min read',
          category: 'Work Visa'
        }
      ]
    },
    es: {
      title: 'Blog de Visas e Inmigración',
      description: 'Mantente actualizado con las últimas noticias, consejos y guías de visas',
      posts: [
        {
          title: 'Los 10 Países con Proceso de Visa Más Fácil en 2024',
          excerpt: 'Descubre qué países ofrecen los procesos de solicitud de visa más simples y rápidos para turistas y viajeros de negocios.',
          author: 'Equipo Danova',
          date: '20 Nov, 2025',
          readTime: '5 min de lectura',
          category: 'Consejos de Viaje'
        },
        {
          title: 'Requisitos de Visa de Estudiante: Guía Completa',
          excerpt: 'Todo lo que necesitas saber sobre la solicitud de visa de estudiante, desde documentación hasta preparación para entrevistas.',
          author: 'Experto en Inmigración',
          date: '18 Nov, 2025',
          readTime: '8 min de lectura',
          category: 'Visa de Estudiante'
        },
        {
          title: 'Visa de Trabajo vs Visa de Negocios: ¿Cuál es la Diferencia?',
          excerpt: 'Entendiendo las diferencias clave entre visas de trabajo y negocios para elegir la opción correcta.',
          author: 'Consultor de Visas',
          date: '15 Nov, 2025',
          readTime: '6 min de lectura',
          category: 'Visa de Trabajo'
        }
      ]
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 sm:py-16 md:py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
            <p className="text-lg sm:text-xl text-muted-foreground">{t.description}</p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {t.posts.map((post, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-2xl hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
