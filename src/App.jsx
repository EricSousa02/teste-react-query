// Importa a biblioteca Axios para fazer requisições HTTP
import axios from "axios";

// Importa as funções necessárias do React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Importa o estilo CSS para o componente
import "./App.css";

// Função principal do componente App
function App() {
  // Obtém uma instância do queryClient para interagir com as queries
  const queryClient = useQueryClient();

  // Realiza uma query para obter dados usando o React Query
  const { data, isPending, error } = useQuery({
    // Define a chave da query como um array contendo "todos"
    queryKey: ["todos"],
    // Define a função de consulta que usa o Axios para obter dados da API
    queryFn: () => axios.get("http://localhost:8080/todos").then((response) => response.data),
  });
  
  // Utiliza a função de mutação para atualizar dados (no caso, marcar/desmarcar como completo)
  const mutation = useMutation({
    // Define a função de mutação que usa o Axios para enviar uma requisição PATCH
    mutationFn: ({ todoId, completed }) =>
      axios
        .patch(`http://localhost:8080/todos/${todoId}`, { completed })
        .then((response) => response.data),
    // Define a ação a ser executada em caso de sucesso na mutação
    onSuccess: (data) => {
      // Atualiza os dados na query "todos" no queryClient
      queryClient.setQueryData(["todos"], (currentData) =>
        currentData.map((todo) => (todo.id === data.id ? data : todo))
      );
    },
    // Define a ação a ser executada em caso de erro na mutação
    onError: (error) => {
      console.error(error);
    },
  });

  // Verifica se a query está pendente (carregando)
  if (isPending) {
    return <div className="loading">Carregando...</div>;
  }

  // Verifica se ocorreu um erro na query
  if (error) {
    return <div className="loading">Algo deu errado!</div>;
  }

  // Renderiza o componente principal
  return (
    <div className="app-container">
      <div className="todos">
        <h2>Todos & React Query</h2>
        {data.map((todo) => (
          <div
            // Configura a função de clique para acionar a mutação ao marcar/desmarcar o todo
            onClick={() => mutation.mutate({ todoId: todo.id, completed: !todo.completed })}
            // Aplica classes condicionais com base no estado de conclusão do todo
            className={`todo ${todo.completed && "todo-completed"}`}
            // Define a chave única para cada todo com base no ID
            key={todo.id}
          >
            {/* Exibe o título do todo */}
            {todo.title}
          </div>
        ))}
      </div>
    </div>
  );
}

// Exporta o componente App para uso em outros arquivos
export default App;
