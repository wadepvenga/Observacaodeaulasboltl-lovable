        // Localização: src/lib/supabaseClient.ts
        import { createClient } from '@supabase/supabase-js';

        // Lê as variáveis de ambiente do arquivo .env (fornecidas pelo Vite)
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        // Verifica se as variáveis foram carregadas corretamente
        if (!supabaseUrl || !supabaseAnonKey) {
          console.error('Erro Crítico: URL ou Chave Anônima do Supabase não encontradas! Verifique o arquivo .env e reinicie o servidor Vite.');
          // Lançar um erro pode parar a aplicação, o que pode ser desejável
          // throw new Error('Supabase URL or Anon Key is missing.');
        }

        // Cria e exporta o cliente Supabase.
        // Só exporta se as variáveis existirem, para evitar erros posteriores.
        export const supabase = (supabaseUrl && supabaseAnonKey) 
          ? createClient(supabaseUrl, supabaseAnonKey)
          : null; 

        // Função auxiliar para obter a URL pública de um arquivo no Storage
        // Isso será útil se a função Supabase precisar acessar o arquivo via URL
        export const getPublicUrl = (filePath: string | null | undefined): string | null => {
          // Verifica se o cliente e o caminho do arquivo são válidos
          if (!supabase || !filePath) {
            return null;
          }
          // Obtém a URL pública do arquivo no bucket especificado
          // !!! MUDE 'uploads' para o nome exato do seu bucket se for diferente !!!
          const { data } = supabase.storage.from('uploads').getPublicUrl(filePath); 
          // Retorna a URL pública ou null se não encontrada
          return data?.publicUrl || null;
        };