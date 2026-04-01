export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-2">Diário Escolar</h3>
            <p className="text-sm">
              Sistema de Gestão Escolar - Escola Municipal de Narandiba
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-2">Links Rápidos</h3>
            <ul className="text-sm space-y-1">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Suporte
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-2">Contato</h3>
            <p className="text-sm">
              Email: admin@escolanarandiba.edu.br
              <br />
              Telefone: (XX) XXXX-XXXX
            </p>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-sm">
          <p>
            © 2024 Diário Escolar de Narandiba. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
