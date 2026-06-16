import avaBanners from '../../img/ava-banners.jpg'

interface HomeProps {
  username: string;
}

export function Home({ username }: HomeProps) {
  return (
    <div style={{ 
      animation: 'fadeIn 0.4s ease',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      {/* Mensagem de Boas-vindas Dinâmica */}
      <div style={{ paddingBottom: '5px' }}>
        <h1 className="page-title" style={{ fontSize: '24px', color: '#1e293b', marginBottom: '4px' }}>
          Olá, {username.replace('.', ' ').toUpperCase()}!
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>
          Bem-vindo de volta ao seu painel institucional UniSales.
        </p>
      </div>

      {/* Container da Imagem de Simulação */}
      <div style={{ 
        width: '100%', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
        backgroundColor: '#fff'
      }}>
        <img 
          src={avaBanners} 
          alt="Painel AVA UniSales" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block',
            objectFit: 'cover'
          }} 
        />
      </div>
    </div>
  )
}