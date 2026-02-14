'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { robotoCondensed } from '@/app/fonts';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  additionalClasses?: {
    overlay?: string;
    modal?: string;
    header?: string;
    content?: string;
  };
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = false,
  closeOnOutsideClick = true,
  additionalClasses,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnOutsideClick &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, closeOnOutsideClick]);

  if (!isOpen) return null;

  const showHeader = title ?? showCloseButton;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${additionalClasses?.overlay ?? ''}`}
    >
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-[0px_4px_4px_0px_#00000040] max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${additionalClasses?.modal ?? ''}`}
      >
        {showHeader && (
          <div
            className={`flex items-center ${title ? 'justify-between' : 'justify-end'} border-b border-[#E6E3DA] px-6 py-4 ${additionalClasses?.header ?? ''}`}
          >
            {title && (
              <h2
                className={`${robotoCondensed.className} text-[20px] font-semibold text-gray-900`}
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
