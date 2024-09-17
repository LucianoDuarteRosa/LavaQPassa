// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../config.js';

const AuthContext = createContext();

// Componente AuthProvider que fornece autenticação e gerenciamento de sessão para os componentes filhos
export const AuthProvider = ({ children }) => {
  // Estado para armazenar o usuário autenticado
  const [user, setUser] = useState(() => {
    // Recupera o usuário salvo do localStorage, se existir
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;// Retorna o usuário salvo ou null se não houver usuário salvo
  });

  // Função para realizar o login
  const login = async (email, password) => {
    try {
      // Envia uma solicitação POST para o endpoint de login com o email e a senha
      const response = await axios.post(`${baseURL}/login`, { email, password });
      if (response.status === 200) {
        // Se a resposta for bem-sucedida, atualiza o estado do usuário e salva os dados no localStorage
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      // Em caso de falha no login, exibe o erro no console e lança o erro para ser tratado em outro lugar
      console.error('Login failed', error);
      throw error;
    }
  };

  // Função para realizar o logout
  const logout = () => {
    // Limpa o estado do usuário e remove o usuário do localStorage
    setUser(null);
    localStorage.removeItem('user');
  };

  // Efeito colateral para recuperar o usuário salvo no localStorage ao montar o componente
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));// Atualiza o estado do usuário se houver um usuário salvo
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


