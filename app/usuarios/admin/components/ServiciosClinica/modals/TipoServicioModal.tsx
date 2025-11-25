// screens/admin/modals/TipoServicioModal.tsx
"use client";
import React from 'react';
import { X } from 'lucide-react';
import '../../../styles/Servicios/TipoServicioModal.css';

interface TipoServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tipo: 'vertical' | 'horizontal') => void;
}

export default function TipoServicioModal({ isOpen, onClose, onSelect }: TipoServicioModalProps) {
  if (!isOpen) return null;

  return (
    <div className="tipo-modal-overlay" onClick={onClose}>
      <div className="tipo-modal-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="btn-close-absolute" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="tipo-title">Selecciona el Diseño</h2>
        <p className="tipo-subtitle">¿Cómo quieres que se vea este servicio en la página?</p>

        <div className="selection-grid">
          
          {/* OPCIÓN 1: VERTICAL */}
          <div className="selection-card" onClick={() => onSelect('vertical')}>
            <div className="visual-preview vertical"></div>
            <h3 className="card-label">Tarjeta Vertical</h3>
            <p className="card-desc">
              Ideal para servicios principales. Imagen grande arriba y texto abajo. Se muestra en cuadrícula compacta.
            </p>
          </div>

          {/* OPCIÓN 2: HORIZONTAL */}
          <div className="selection-card" onClick={() => onSelect('horizontal')}>
            <div className="visual-preview horizontal"></div>
            <h3 className="card-label">Tarjeta Horizontal</h3>
            <p className="card-desc">
              Ideal para listados detallados. Imagen a la izquierda y contenido a la derecha. Ocupa el ancho completo.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}