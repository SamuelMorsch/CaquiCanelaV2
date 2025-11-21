import React from 'react';

// Página genérica para "Sobre", "Contato", "Políticas"
export default function GenericPage({ title }) {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-brand-secondary font-serif mb-6 text-center">
          {title}
        </h1>
        <div className="space-y-4 text-brand-text prose lg:prose-lg">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            efficitur, felis eget feugiat tincidunt, nisi turpis convallis
            tellus, id sagittis leo massa id felis.
          </p>
          <p>
            Nulla facilisi. Duis egestas, erat ut aliquet feugiat,
            sapien est congue nibh, in pulvinar nunc libero sed nisl.
            Donec sit amet facilisis metus.
          </p>
          {title === "Contato" && (
            <div className="mt-6">
              <p><strong>Email:</strong> contato@caquicanela.com</p>
              <p><strong>Telefone:</strong> (51) 99999-8888</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}