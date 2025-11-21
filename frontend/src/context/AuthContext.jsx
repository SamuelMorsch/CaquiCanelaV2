import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importa o decodificador de JWT

// 1. Cria o Contexto
const AuthContext = createContext(null);

// 2. Cria o Provedor
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // 'customer', 'owner', 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Efeito para carregar dados do localStorage ao iniciar
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("caquicanela_token");
      if (storedToken) {
        const decodedToken = jwtDecode(storedToken); // Decodifica o token
        
        // Verifica se o token expirou
        if (decodedToken.exp * 1000 > Date.now()) {
          // Token válido
          setToken(storedToken);
          setRole(decodedToken.role); // Pega o 'role' de dentro do token
          // O seu backend não coloca o 'user' no token, vamos simular
          const simulatedUser = { id: decodedToken.id, email: `user-${decodedToken.id}@email.com` }; 
          setUser(simulatedUser);
          setIsAuthenticated(true);
        } else {
          // Token expirado
          localStorage.removeItem("caquicanela_token");
        }
      }
    } catch (error) {
      console.error("Falha ao carregar token:", error);
      localStorage.removeItem("caquicanela_token");
    } finally {
      setLoading(false); // Termina de carregar
    }
  }, []);

  // Função de Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', { // Usa o proxy
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Credenciais inválidas');

      // Sucesso
      const decodedToken = jwtDecode(data.token);
      setToken(data.token);
      setRole(decodedToken.role);
      const simulatedUser = { id: decodedToken.id, email: `user-${decodedToken.id}@email.com` };
      setUser(simulatedUser);
      setIsAuthenticated(true);
      
      localStorage.setItem("caquicanela_token", data.token);
      return { success: true, role: decodedToken.role };

    } catch (err) {
      console.error("Erro no login:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Função de Registro
  const register = async (userData) => {
    setLoading(true);
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password
    };

    try {
      const response = await fetch('/api/auth/register', { // Usa o proxy
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao registrar');
      
      return { success: true };

    } catch (err) {
      console.error("Erro no registro:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Função de Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem("caquicanela_token");
  };

  // 3. Valor compartilhado
  const value = {
    user,
    token,
    role, // Exporta o 'role'
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

// 4. Hook customizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
}