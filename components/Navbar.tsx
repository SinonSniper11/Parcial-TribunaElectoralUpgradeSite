import styles from '../styles/Navbar.module.css'

const menu = [
  { label: 'Inicio', href: '#' },
  { label: 'El Tribunal', href: '#' },
  { label: 'Servicios', href: '#' },
  { label: 'Transparencia', href: '#' },
  { label: 'Normativas', href: '#' },
  { label: 'Noticias', href: '#' },
  { label: 'Contacto', href: '#' }
]

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src="/file.svg" alt="Logo Tribunal Electoral" />
        <span>Tribunal Electoral</span>
      </div>
      <ul className={styles.menu}>
        {menu.map((item) => (
          <li key={item.label}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}