import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Heart, X } from 'lucide-react';

const ITEMS = [
  { id: '1', name: 'Shadow Crown', price: '450', cat: 'Hats', rarity: 'Legendary', rarityClass: 'rarity-legendary', img: 'https://images.pexels.com/photos/14580574/pexels-photo-14580574.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '2', name: 'Neon Visor', price: '320', cat: 'Accessories', rarity: 'Epic', rarityClass: 'rarity-epic', img: 'https://images.pexels.com/photos/9154411/pexels-photo-9154411.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '3', name: 'Dark Shades', price: '180', cat: 'Faces', rarity: 'Rare', rarityClass: 'rarity-rare', img: 'https://images.pexels.com/photos/10882421/pexels-photo-10882421.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '4', name: 'Dark Hoodie', price: '75', cat: 'Accessories', rarity: 'Common', rarityClass: 'rarity-common', img: 'https://images.pexels.com/photos/3894527/pexels-photo-3894527.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '5', name: 'Neon Mask', price: '290', cat: 'Faces', rarity: 'Epic', rarityClass: 'rarity-epic', img: 'https://images.pexels.com/photos/5701170/pexels-photo-5701170.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: '6', name: 'Dark Wings', price: '850', cat: 'Limiteds', rarity: 'Legendary', rarityClass: 'rarity-legendary', img: 'https://images.pexels.com/photos/20329578/pexels-photo-20329578.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: Array<{x: number, y: number, r: number, dx: number, dy: number, a: number}> = [];

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        a: Math.random() * 0.5 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 30, 30, ${p.a})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current && dotRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
        dotRef.current.style.transform = `translate3d(${e.clientX - 2.5}px, ${e.clientY - 2.5}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden md:block" style={{ top: 0, left: 0 }}></div>
      <div ref={dotRef} className="custom-cursor-dot hidden md:block" style={{ top: 0, left: 0 }}></div>
    </>
  );
}

export default function App() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<typeof ITEMS[0] | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredItems = ITEMS.filter(item => {
    if (filter === 'Favoritos') {
      return favorites.has(item.id) && item.name.toLowerCase().includes(search.toLowerCase());
    }
    const matchesFilter = filter === 'All' || item.cat.toLowerCase() === filter.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedItem]);

  return (
    <div className="w-full overflow-x-hidden scrollbar-hide bg-[#0A0A0A] text-white">
      <CustomCursor />
      <ParticlesBackground />
      
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 group cursor-pointer">
            <iframe 
              src="/3d-crystal.html" 
              title="3D Crystal Logo"
              className="w-10 h-10 pointer-events-none relative z-10 group-hover:scale-110 transition-transform"
              style={{ border: 'none', background: 'transparent' }}
            />
            <h1 className="font-extrabold text-lg tracking-wider group-hover:text-[#FF1E1E] transition-colors">UGC DARK STUDIOS</h1>
          </a>
          <div className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-[0.15em]">
            <a href="#home" className="hover:text-red-500 transition-colors">Home</a>
            <a href="#catalog" className="hover:text-red-500 transition-colors">Catálogo</a>
            <a href="#mannequins" className="hover:text-red-500 transition-colors">Manequins</a>
            <a 
              href="https://discord.gg/SzuFSMtt3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#FF1E1E]/10 border border-[#FF1E1E]/50 text-[#FF1E1E] hover:bg-[#FF1E1E] hover:text-white transition-all flex items-center gap-2 font-bold tracking-widest text-[11px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor" className="w-4 h-4">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c0,0,0-.09,0-.13C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.09,53,91,65.69,84.69,65.69Z"/>
              </svg>
              DISCORD
            </a>
          </div>
          <button className="md:hidden relative z-50 p-2 -mr-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
            {isMobileMenuOpen ? <X className="w-8 h-8 text-white" /> : <Menu className="w-8 h-8 text-white" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 glass-strong border-b border-white/10 z-40 flex flex-col p-6 gap-6 md:hidden"
          >
            <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="font-bold uppercase tracking-widest text-sm hover:text-red-500 transition-colors">Home</a>
            <a href="#catalog" onClick={() => setIsMobileMenuOpen(false)} className="font-bold uppercase tracking-widest text-sm hover:text-red-500 transition-colors">Catálogo</a>
            <a href="#mannequins" onClick={() => setIsMobileMenuOpen(false)} className="font-bold uppercase tracking-widest text-sm hover:text-red-500 transition-colors">Manequins</a>
            <a 
              href="https://discord.gg/SzuFSMtt3" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-3 rounded-xl bg-[#FF1E1E]/10 border border-[#FF1E1E]/50 text-[#FF1E1E] flex items-center justify-center gap-2 font-bold tracking-widest text-[11px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor" className="w-4 h-4">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c0,0,0-.09,0-.13C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.09,53,91,65.69,84.69,65.69Z"/>
              </svg>
              DISCORD
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <header id="home" className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A] z-[1]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <div className="inline-block mb-2 relative w-32 h-32 md:w-48 md:h-48 mx-auto flex items-center justify-center">
            {/* The glow effect behind the crystal */}
            <div className="absolute inset-0 bg-red-600/20 blur-[30px] rounded-full pulse-glow pointer-events-none"></div>
            <iframe 
              src="/3d-crystal.html" 
              title="3D Crystal"
              className="w-full h-full relative z-10"
              style={{ border: 'none', background: 'transparent' }}
            />
          </div>
          <h2 className="font-black uppercase tracking-[0.2em] leading-tight text-4xl md:text-5xl lg:text-[52px]">
            UGC Dark Studios
          </h2>
          <p className="mt-6 max-w-2xl mx-auto leading-relaxed opacity-70 text-base">
            Descubra itens exclusivos para seu avatar Roblox. Design futurista, qualidade de estúdio e atualizações constantes. Explore manequins, filtros personalizados e compre direto no Roblox.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#catalog" className="px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 glow-red bg-[#FF1E1E] text-white">
              Explorar Catálogo
            </a>
            <a href="#mannequins" className="px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm border border-white/20 hover:border-red-500/50 transition-all hover:scale-105 bg-transparent text-white">
              Ver Coleções
            </a>
          </div>
        </motion.div>
      </header>

      {/* CATALOG */}
      <section id="catalog" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-black uppercase tracking-[0.15em] text-3xl md:text-[36px]">Catálogo UGC</h2>
            <p className="mt-4 opacity-60 text-base">Explore itens exclusivos para seu avatar Roblox</p>
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-4 mb-10 justify-between"
          >
            <div className="flex flex-wrap justify-center gap-2">
              {['All', 'Favoritos', 'Hats', 'Hair', 'Faces', 'Accessories', 'Limiteds', 'Trending'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold glass transition-colors flex items-center gap-2 ${filter === f ? '!bg-[#FF1E1E] !text-white' : 'hover:bg-white/10'}`}
                >
                  {f === 'Favoritos' && <Heart className="w-3 h-3" fill={filter === 'Favoritos' ? 'white' : 'none'} color={filter === 'Favoritos' ? 'white' : '#FF1E1E'} />}
                  {f === 'All' ? 'Todos' : f}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass text-sm text-white outline-none focus:border-red-500/50 border border-transparent transition-colors" 
                placeholder="Pesquisar itens..." 
              />
            </div>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full py-12 text-center opacity-50"
                >
                  Nenhum item encontrado.
                </motion.div>
              ) : (
                filteredItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="glass rounded-2xl overflow-hidden glow-red-hover group transition-transform hover:-translate-y-1"
                  >
                    <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedItem(item)}>
                      <img loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.img} alt={item.name} />
                      <span className={`absolute top-3 left-3 ${item.rarityClass} px-3 py-1 rounded-full text-xs font-bold`}>
                        {item.rarity}
                      </span>
                      <button 
                        onClick={(e) => toggleFavorite(e, item.id)}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-red-500/30 transition-colors" 
                        aria-label="Favoritar"
                      >
                        <Heart className="w-4 h-4" color={favorites.has(item.id) ? 'transparent' : '#FF1E1E'} fill={favorites.has(item.id) ? '#FF1E1E' : 'none'} />
                      </button>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <span className="font-bold text-sm text-[#FF1E1E]">R$ {item.price}</span>
                      </div>
                      <p className="text-xs uppercase tracking-wider opacity-50 mb-4">{item.cat}</p>
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="w-full py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] bg-[#FF1E1E] text-white"
                      >
                        Visualizar
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* MANNEQUINS */}
      <section id="mannequins" className="py-24 px-6 relative z-10 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-black uppercase tracking-[0.15em] text-3xl md:text-[36px]">Coleções Premium</h2>
            <p className="mt-4 opacity-60 text-base">Avatares exclusivos com os melhores outfits UGC</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Shadow Collection', desc: 'Dark elite streetwear', img: 'https://images.pexels.com/photos/33888381/pexels-photo-33888381.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { title: 'Cyber Collection', desc: 'Futuristic tech wear', img: 'https://images.pexels.com/photos/31903947/pexels-photo-31903947.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { title: 'Neon Collection', desc: 'Neon-lit premium fits', img: 'https://images.pexels.com/photos/7688595/pexels-photo-7688595.jpeg?auto=compress&cs=tinysrgb&w=800' }
            ].map((collection, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="glass rounded-2xl overflow-hidden glow-red-hover transition-all group"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={collection.img} alt={collection.title} />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold uppercase tracking-wider text-lg">{collection.title}</h3>
                  <p className="mt-2 text-sm opacity-50">{collection.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setSelectedItem(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative z-10 glass-strong rounded-3xl max-w-2xl w-full overflow-hidden border border-white/10 shadow-2xl"
            >
              <div className="relative">
                <img src={selectedItem.img} className="w-full aspect-video object-cover" alt="Item preview" />
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black uppercase tracking-wider">{selectedItem.name}</h3>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-[#FF1E1E] font-bold text-lg">R$ {selectedItem.price}</span>
                  <span className="text-xs uppercase tracking-wider opacity-50 border border-white/10 px-3 py-1 rounded-full">{selectedItem.cat}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedItem.rarityClass}`}>{selectedItem.rarity}</span>
                </div>
                <p className="mt-5 text-sm opacity-60 leading-relaxed">
                  Este item exclusivo da UGC Dark Studios traz um design futurista premium para o seu avatar Roblox. Disponível por tempo limitado.
                </p>
                <button className="mt-8 w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-[1.02] glow-red bg-[#FF1E1E] text-white">
                  Comprar no Roblox
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-16 px-6 bg-[#0A0A0A] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <a href="#home" className="flex items-center gap-3 mb-4 group cursor-pointer">
                <iframe 
                  src="/3d-crystal.html" 
                  title="3D Crystal Logo"
                  className="w-10 h-10 pointer-events-none relative z-10 group-hover:scale-110 transition-transform"
                  style={{ border: 'none', background: 'transparent' }}
                />
                <span className="font-extrabold tracking-wider group-hover:text-[#FF1E1E] transition-colors">UGC DARK STUDIOS</span>
              </a>
              <p className="text-sm opacity-40 leading-relaxed">
                Premium Roblox UGC Catalog. Design futurista, qualidade profissional.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-4">Links Rápidos</h4>
              <div className="flex flex-col gap-3">
                <a href="#home" className="text-sm opacity-40 hover:opacity-100 hover:text-red-500 transition-all">Home</a>
                <a href="#catalog" className="text-sm opacity-40 hover:opacity-100 hover:text-red-500 transition-all">Catálogo</a>
                <a href="#mannequins" className="text-sm opacity-40 hover:opacity-100 hover:text-red-500 transition-all">Coleções</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-wider text-sm mb-4">Comunidade</h4>
              <div className="flex gap-4">
                <a 
                  href="https://discord.gg/SzuFSMtt3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-red-500 hover:text-white text-white/60 transition-colors" 
                  aria-label="Discord"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor" className="w-5 h-5">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1,105.25,105.25,0,0,0,32.19-16.14c0,0,0-.09,0-.13C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.09,53,91,65.69,84.69,65.69Z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/ugc.darkstudios/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-red-500 hover:text-white text-white/60 transition-colors" 
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a 
                  href="https://www.tiktok.com/@ugcdarkstudios" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-red-500 hover:text-white text-white/60 transition-colors" 
                  aria-label="TikTok"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4">
                    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-xs opacity-30">© {new Date().getFullYear()} UGC Dark Studios. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
