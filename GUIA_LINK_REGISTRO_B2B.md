# Guía Rápida: Agregar Link al Registro B2B desde Home

## 📍 Ubicación Sugerida

Agregar el link al registro profesional en la página Home, típicamente en:
1. **Hero section** - Botón secundario junto a "Comenzar"
2. **Sección dedicada** - Banner para profesionales
3. **Footer** - Link en menú

---

## 🎨 Opción 1: Botón en Hero Section

Agregar en `frontend/src/components/Home.jsx`:

```jsx
<div className="hero-buttons">
  <Link to="/paquetes" className="btn-primary">
    Comenzar
  </Link>
  
  {/* NUEVO: Botón B2B */}
  <Link to="/registro-profesional" className="btn-outline">
    ¿Eres agencia? Regístrate aquí
  </Link>
</div>
```

**CSS para `.btn-outline`:**
```css
.btn-outline {
  padding: 1rem 2rem;
  border: 2px solid white;
  color: white;
  background: transparent;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}
```

---

## 🎨 Opción 2: Sección Dedicada B2B

Agregar después del hero section:

```jsx
<section className="b2b-banner">
  <div className="container">
    <div className="b2b-content">
      <div className="b2b-text">
        <h2>¿Eres una Agencia de Viajes?</h2>
        <p>
          Registra tu empresa y accede a tarifas especiales, herramientas
          profesionales y soporte dedicado para tu negocio turístico.
        </p>
        <ul className="b2b-benefits">
          <li>✅ Precios mayoristas exclusivos</li>
          <li>✅ Panel de gestión profesional</li>
          <li>✅ Soporte prioritario 24/7</li>
          <li>✅ Facturación automática</li>
        </ul>
      </div>
      <div className="b2b-action">
        <Link to="/registro-profesional" className="btn-b2b">
          Registro Profesional
        </Link>
        <p className="b2b-note">
          Válido para agencias, operadores y proveedores
        </p>
      </div>
    </div>
  </div>
</section>
```

**CSS para banner B2B:**
```css
.b2b-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
  margin: 3rem 0;
}

.b2b-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.b2b-text h2 {
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.b2b-text p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.b2b-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
}

.b2b-benefits li {
  color: white;
  font-size: 1rem;
  padding: 0.5rem 0;
}

.b2b-action {
  text-align: center;
}

.btn-b2b {
  display: inline-block;
  padding: 1.25rem 2.5rem;
  background: white;
  color: #667eea;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.btn-b2b:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
}

.b2b-note {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  margin-top: 0.75rem;
}

@media (max-width: 768px) {
  .b2b-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
```

---

## 🎨 Opción 3: Link Sutil en Navbar

Modificar `frontend/src/components/Navbar.jsx`:

```jsx
<nav className="navbar">
  <div className="navbar-container">
    {/* Logo y links existentes */}
    
    {/* Agregar en el extremo derecho */}
    <Link to="/registro-profesional" className="nav-link-b2b">
      🏢 Registro Profesional
    </Link>
  </div>
</nav>
```

**CSS:**
```css
.nav-link-b2b {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-link-b2b:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

---

## 🎨 Opción 4: Modal Informativo

Agregar un modal que aparece al hacer scroll o después de X segundos:

```jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function B2BModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Mostrar después de 10 segundos
    const timer = setTimeout(() => {
      const alreadyShown = sessionStorage.getItem("b2bModalShown");
      if (!alreadyShown) {
        setShow(true);
        sessionStorage.setItem("b2bModalShown", "true");
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={() => setShow(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShow(false)}>
          ×
        </button>
        <h3>¿Eres Agencia de Viajes?</h3>
        <p>
          Registra tu empresa y accede a herramientas profesionales y
          tarifas especiales.
        </p>
        <Link to="/registro-profesional" className="btn-modal">
          Registrarme como Profesional
        </Link>
        <button className="btn-text" onClick={() => setShow(false)}>
          Ahora no
        </button>
      </div>
    </div>
  );
}

export default B2BModal;
```

**Incluir en Home.jsx:**
```jsx
import B2BModal from "./B2BModal";

function Home() {
  return (
    <div>
      {/* Contenido existente */}
      
      <B2BModal />
    </div>
  );
}
```

---

## 🎯 Recomendación

**Para máxima conversión**, usar **Opción 2 (Banner dedicado)** + **Opción 3 (Link en navbar)**.

Esto asegura:
- ✅ Visibilidad prominente sin ser intrusivo
- ✅ Acceso rápido desde navbar
- ✅ Información suficiente para decidir
- ✅ No interrumpe experiencia B2C

---

## 🔄 Flujo Completo

1. Usuario visita homepage
2. Ve banner "¿Eres Agencia?"
3. Click en "Registro Profesional"
4. Redirección a `/registro-profesional`
5. Wizard de 3 pasos
6. Registro exitoso
7. Redirección a `/dashboard`

---

## 📱 Consideraciones Mobile

- Banner B2B debe adaptarse a pantalla pequeña
- Botones con tamaño táctil adecuado (min 44px)
- Texto legible sin zoom
- Banner colapsable si es muy largo

---

## 🎨 Colores del Sistema

Para mantener consistencia visual:

```css
/* Primarios */
--b2b-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--b2b-primary: #667eea;
--b2b-secondary: #764ba2;

/* Botones */
--btn-bg: white;
--btn-text: #667eea;
--btn-hover: #f7fafc;
```

---

## ✅ Checklist de Implementación

- [ ] Decidir ubicación del link (Hero/Banner/Navbar)
- [ ] Agregar componente/link en archivo correspondiente
- [ ] Agregar estilos CSS
- [ ] Probar redirección a `/registro-profesional`
- [ ] Verificar responsive en mobile
- [ ] Ajustar textos según público objetivo
- [ ] Agregar analytics tracking (opcional)

---

**Tiempo estimado**: 15-30 minutos
**Archivos a modificar**: Home.jsx + home.css (o navbar según opción)
