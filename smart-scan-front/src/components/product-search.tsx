import { useState, useRef, type ChangeEvent } from 'react';
import { cn } from '../lib/utils';

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onImageUpload: (file: File) => void;
  isLoading?: boolean;
}

export const ProductSearch = ({ 
  searchTerm, 
  onSearchChange, 
  onImageUpload,
  isLoading = false 
}: ProductSearchProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Por favor, selecione uma imagem válida (JPG, PNG ou GIF)');
        return;
      }

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Enviar para componente pai
      onImageUpload(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Campo de busca por texto */}
          <div className="flex-1 sm:flex-[3] relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar produtos por nome ou categoria..."
              className={cn(
                "input",
                "pl-10 pr-4"
              )}
              aria-label="Buscar produtos"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Botão de upload de imagem */}
          <button
            onClick={handleCameraClick}
            disabled={isLoading}
            className={cn(
              "btn-secondary",
              "flex items-center justify-center gap-2 sm:flex-[1] min-w-fit sm:w-auto whitespace-nowrap",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Buscar por foto"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="hidden sm:inline">Processando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="hidden sm:inline">Buscar por Foto</span>
                <span className="sm:hidden">Foto</span>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleImageChange}
            className="hidden"
            aria-label="Upload de imagem"
          />
        </div>

        {/* Preview da imagem */}
        {previewImage && (
          <div className="mt-4 animate-fade-in">
            <div className="relative inline-block">
              <img
                src={previewImage}
                alt="Preview da busca"
                className="h-32 sm:h-40 rounded-lg object-cover shadow-md"
              />
              <button
                onClick={clearPreview}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                aria-label="Remover imagem"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Buscando produtos similares...</p>
          </div>
        )}
      </div>
    </div>
  );
};
