"use client";

import { useEffect, useState } from "react";
import { TipoTarefa } from "@/types";
import { format } from "date-fns";

export default function Tarefa() {


    //Modal alterar tarefa
    const [isModalAlterarOpen, setIsModalAlterarOpen] = useState(false);
    const [tarefaEditando, setTarefaEditando] = useState<number | null>(null);
    const openModalAlterar = (idTarefa: number) => {
        setTarefaEditando(idTarefa); // Define qual tarefa será editada
        setIsModalAlterarOpen(true);
    };
    const closeModalAlterar = () => setIsModalAlterarOpen(false);
    const [tarefas, setTarefas] = useState<TipoTarefa[]>([]);

    const [isModalInserirOpen, setIsModalInserirOpen] = useState(false);
    const openModalInserir = () => setIsModalInserirOpen(true);
    const closeModalInserir = () => setIsModalInserirOpen(false);
    
    const [novaTarefa, setNovaTarefa] = useState<TipoTarefa>({
        idTarefa: 0,
        nome: "",
        custo: "",
        dataLimite: "",
        ordem: 0
    });
    
    // Converter a data para o usuário
    function formatDate(date: string | Date) {
        return format(new Date(date), 'dd/MM/yyyy');  
    }

    //Confirmar Delete
    const [isModalConfirmarDeleteOpen, setIsModalConfirmarDeleteOpen] = useState(false);
    const[tarefaDeletando, setTarefaDeletando] = useState<number | null>(null);
    const openModalConfirmarDelete = (idTarefa: number) => {
        setTarefaDeletando(idTarefa);
        setIsModalConfirmarDeleteOpen(true);
    }
    const closeModalConfirmarDelete = () => setIsModalConfirmarDeleteOpen(false);


    // GET
    useEffect(() => {
        const fetchTarefas = async () => {

        try{
            const response = await fetch('/api/tarefas/listar');
            const data = await response.json();

            setTarefas(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error("Não consegui puxar a lista de tarefas!", error);
        }
        };
    
        fetchTarefas();
    }, []);

    //abrir modal

    //PUT 
    const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>, idTarefa: number) => {
        e.preventDefault();
    
        try {
            const response = await fetch(
                `http://localhost:8080/tarefas/alterar?idTarefa=${idTarefa}`,
                {
                    method: "PUT",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(novaTarefa),
                }
            );


            if (response.ok) {
                console.log("Tarefa atualizado com sucesso!");
                closeModalAlterar();
            }

            } catch (error) {
            console.error("Erro ao atualizar tarefa: ", error);
            alert("Erro ao atualizar Tarefa!");
            }

            if (
                !novaTarefa.nome ||
                !novaTarefa.custo ||
                !novaTarefa.dataLimite 
            ) {
                alert("Todos os campos são obrigatórios.");
                return;
            }

            window.location.reload();
        };

    //DELETE
    const handleDelete = async (idTarefa :number)=>{

        try {
            const response = await fetch( `http://localhost:8080/tarefas/excluir?idTarefa=${idTarefa}`,{
                method: 'DELETE',
            });
            
            if(response.ok){
                console.log("Tarefa removida com sucesso!")  
                window.location.reload();          
            }

        } catch (error) {
            console.error("Falha ao remover tarefa.", error);
            alert("Falha ao remover tarefa!")
        }

    }

    

    const setOrdem = async (ordem: number, idTarefa: number) => {
    
        try {
            console.log(`Enviado ordem: ${ordem}, idTarefa: ${idTarefa}`);
            const response = await fetch(
                `http://localhost:8080/tarefas/setOrdem?ordem=${ordem}&idTarefa=${idTarefa}`,
                {
                    method: "PUT",
                    headers: {
                    "Content-Type": "application/json",
                    }
                }
            );

            if (response.ok) {
                console.log( 'Ordem alterada')
            }

            } catch (error) {
            console.error("Erro ao atualizar tarefa: ", error);
            }
            
    };


    //POST
    const handleSubmitNovaTarefa = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ultimoOrdem = tarefas.length > 0 ? tarefas[tarefas.length - 1].ordem : 0;
        const novaOrdem = (ultimoOrdem + 1);
        console.log(novaOrdem );


        try {
            const response = await fetch( `http://localhost:8080/tarefas/inserir?ordem=${novaOrdem}`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(novaTarefa),
            });

            if (
                !novaTarefa.nome ||
                !novaTarefa.custo ||
                !novaTarefa.dataLimite 
            ) {
                alert("Todos os campos são obrigatórios.");
                return;
            }

            const tarefaExiste = tarefas.find(tarefa => (tarefa.nome === novaTarefa.nome) )

            if (tarefaExiste) {
                alert("Tarefa já existe");
            }
            
            if (response.ok){
                console.log("Tarefa adiciona com sucesso!")
                closeModalInserir();
            }
        } catch (error) {
            console.error("Falha ao adicionar tarefa.", error);
            alert("Falha ao adicionar tarefa!")
        }

        window.location.reload();

    }

    const moverParaCima = async (index: number) => {
        if (index > 0) {
            
            const tarefasAtualizadas = [...tarefas];
    
            
            const tarefaAtual = tarefasAtualizadas[index];
            const tarefaAnterior = tarefasAtualizadas[index - 1];
    
            
            const novaOrdem = tarefaAtual.ordem;
            tarefaAtual.ordem = tarefaAnterior.ordem;
            tarefaAnterior.ordem = novaOrdem;
    
            try{
                console.log("recebe -1: " + "id: " + tarefaAtual.idTarefa);
                await setOrdem(-1, tarefaAtual.idTarefa);
                console.log("recebe: " + tarefaAnterior.ordem + "id: " + tarefaAnterior.idTarefa)
                await setOrdem(tarefaAnterior.ordem, tarefaAnterior.idTarefa);
                console.log("recebe: " + tarefaAtual.ordem + "id: " + tarefaAtual.idTarefa)
                await setOrdem(tarefaAtual.ordem, tarefaAtual.idTarefa);

                console.log("Todas as ordens foram atualizadas. Recarregando...");
                window.location.reload();
            } catch (error) {
                console.error("Erro ao atualizar ordens:", error);
                alert("Erro ao atualizar ordens:");
            }
        }
    };
    
    const moverParaBaixo = async (index: number) => {
        if (index < tarefas.length - 1) {

            const tarefasAtualizadas = [...tarefas];
    
            
            const tarefaAtual = tarefasAtualizadas[index];
            const tarefaProxima = tarefasAtualizadas[index + 1];
    

            const novaOrdem = tarefaAtual.ordem;
            tarefaAtual.ordem = tarefaProxima.ordem;
            tarefaProxima.ordem = novaOrdem;
    
            
            try{
                await setOrdem(-1, tarefaAtual.idTarefa);
                await setOrdem(tarefaProxima.ordem, tarefaProxima.idTarefa);
                await setOrdem(tarefaAtual.ordem, tarefaAtual.idTarefa);

                console.log("Todas as ordens foram atualizadas. Recarregando...");
                window.location.reload();
            } catch (error) {
                console.error("Erro ao atualizar ordens:", error);
            }
        }
    };

    



        return (
            <div>
                <div className="flex flex-col justify-center items-center mt-20 text-white ">
                    <div className="w-full flex flex-col justify-center  md:justify-between ">
                        
                        {tarefas.sort((a,b) => a.ordem - b.ordem)
                        .map((tarefa: TipoTarefa, index) => (
                            <div
                                key={tarefa.idTarefa}
                                className=" relative mx-5 sm:mx-[100px] md:mx-[200px] lg:mx-[300px]  h-[250px] bg-red-700 p-10 pt-8  m-5 mt- 2 rounded-lg text-white text-[clamp(1.1rem,_4vw,_1.3rem)] mb-10">
                                
                                {/* não exibir seta para cima na primeira tarefa  */}
                                {index > 0 && (
                                <button
                                    onClick={() => moverParaCima(index)}
                                    className="absolute left-[40px] bottom-[20px] bg-white text-red-700 hover:bg-red-900 px-3 py-1 rounded mr-2 mb-3 "
                                    
                                >
                                    ↑
                                </button>
                                )}
                                {/* não exibir seta para baixo na última tarefa */}
                                {index < tarefas.length - 1 && (
                                <button
                                    onClick={() => moverParaBaixo(index)}
                                    className="absolute left-[80px] bottom-[20px] bg-white text-red-700 hover:bg-red-900 px-3 py-1 rounded mb-3"
                                    style={{ left: index === 0 ? '40px' : '80px' }}
                                >
                                    ↓
                                </button>
                                )}

                                <h2 className="text-[clamp(1.0rem,_5vw,_2.6rem)] md:text-1.0rem ">{tarefa.nome}</h2>
                                <div className="flex flex-row mt-5 mr-5">
                                    <p className={`mr-20 ${Number(tarefa.custo) >= 1000 ? 'flex bg-white text-red-700 rounded-md px-3 px-3 items-center' : ''}`}
                                    >R${Number(tarefa.custo).toFixed(2)}
                                    </p> 
                                    <p>Data limite: {formatDate(tarefa.dataLimite)}</p>
                                </div>
                                <button type="button" onClick={() => openModalConfirmarDelete(tarefa.idTarefa)} className="absolute mr-2 top-4 right-4 text-white text-3xl hover:text-red-800">X</button>


                                {/* Modal confirmar Delete*/}
                                {isModalConfirmarDeleteOpen && tarefa.idTarefa === tarefaDeletando && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                                    <div className="relative flex flex-col bg-red-700 p-6 rounded-lg shadow-lg w-full mx-[2em] md:w-[30rem] lg:w-[40rem] h-[10rem] justify-center">
                                        
                                        <h2 className="flex text-4xl text-white mb-4 justify-center">Deseja deletar tarefa {tarefa.nome} ?</h2>
                                        <div className="flex flex-row justify-center gap-4">
                                            <button type="submit" onClick={() => handleDelete(tarefa.idTarefa)} className=" mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-white hover:text-red-700">
                                                    sim
                                            </button>
                                            <button type="submit" onClick={closeModalConfirmarDelete} className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-white hover:text-red-700">
                                                    não
                                            </button>
                                        </div>

                                    </div>
                                    </div>
                                )}
                                
                                
                                
                                
                                <button onClick={() => openModalAlterar(tarefa.idTarefa)} className="absolute mr-4 bottom-7 right-8 mt-4 px-8 py-2 hover:bg-red-800 hover:text-white rounded-full bg-white text-red-700">Editar</button>
        
                                {/* Modal Alterar*/}
                                {isModalAlterarOpen && tarefa.idTarefa === tarefaEditando && (
                                    
                                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                                        <div className="relative flex flex-col bg-red-700 p-6 rounded-lg shadow-lg w-full mx-[2em] md:w-[30rem] lg:w-[40rem]">
                                            <button type="button" onClick={closeModalAlterar} className="absolute mr-2 top-2 right-2 text-white text-lg">
                                                X
                                            </button>
        
                                            <h2 className="text-4xl mb-5 ">Editar Dados</h2>
                                            <form onSubmit={(e) => handleSubmitEdit(e, tarefa.idTarefa)}>
                                                <label htmlFor="nome" className="text-3lg">Nome:</label>
                                                <input
                                                    id="nome"
                                                    type="text"
                                                    placeholder="Novo nome da tarefa"
                                                    value={novaTarefa.nome}
                                                    onChange={(e) =>
                                                        setNovaTarefa({ ...novaTarefa, nome: e.target.value })
                                                    }
                                                    className="my-2 p-2 w-full border border-gray-300 rounded-lg text-gray-600"
                                                />

                                                <label htmlFor="data" className="text-3lg">Custo:</label>
                                                <input
                                                    id="number"
                                                    type="number"
                                                    placeholder="Custo da tarefa"
                                                    value={novaTarefa.custo}
                                                    onChange={(e) =>
                                                        setNovaTarefa({ ...novaTarefa, custo: e.target.value })
                                                    }
                                                    className="my-2 p-2 w-full border border-gray-300 rounded-lg text-gray-600"
                                                />

                                                <label htmlFor="data" className="text-3lg">Data limite:</label>
                                                <input
                                                    id="data"
                                                    type="date"
                                                    value={novaTarefa.dataLimite}
                                                    onChange={(e) =>
                                                        setNovaTarefa({ ...novaTarefa, dataLimite: e.target.value })
                                                    }
                                                    className="my-2 p-2 w-full border border-gray-300 rounded-lg text-gray-600"
                                                />
                                                <p className="text-sm m-2 mt-4">* Preencha todos os campos</p>
        
                                                <button type="submit" className="mt-4 px-4 py-2 bg-red-800 text-white 0 rounded hover:bg-white hover:text-red-700">
                                                    Salvar
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <button onClick={openModalInserir} 
                            className="text-[clamp(1.5rem,_5vw,_2rem)] relative mx-5 sm:mx-[100px] md:mx-[200px] lg:mx-[500px] m-10 mt-20 px-8 py-4 rounded-full hover:bg-white hover:text-red-700 hover:border-4 hover:border-red-700 text-white bg-red-700 border-4 border-white flex justify-center">
                            Nova Tarefa
                        </button>
                        
                        {/* Modal Inserir*/}
                        {isModalInserirOpen  && ( 
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                            <div className="relative flex flex-col bg-red-700 p-6 rounded-lg shadow-lg w-full mx-[2em] md:w-[30rem] lg:w-[40rem]">
                                <button type="button" onClick={closeModalInserir} className="absolute mr-2 top-2 right-2 text-white text-lg">
                                    X
                                </button>

                                <h2 className="text-4xl mb-5">Nova tarefa</h2>
                                <form onSubmit={(e) => handleSubmitNovaTarefa(e)}>
                                    <label htmlFor="nome" className="text-3lg">Nome:</label>
                                    <input
                                        id="nome"
                                        type="text"
                                        placeholder="Novo nome da tarefa"
                                        value={novaTarefa.nome}
                                        onChange={(e) =>
                                            setNovaTarefa({ ...novaTarefa, nome: e.target.value })
                                        }
                                        className="my-2 p-2 w-full border border-gray-300 rounded-lg text-gray-600"
                                    />

                                    <label htmlFor="data" className="text-3lg">Custo:</label>
                                    <input
                                        id="number"
                                        type="number"
                                        placeholder="Custo da tarefa"
                                        value={novaTarefa.custo}
                                        onChange={(e) =>
                                            setNovaTarefa({ ...novaTarefa, custo: e.target.value })
                                        }
                                        className="my-2 p-2 w-full border border-gray-300 rounded-lg text-gray-600"
                                    />

                                    <label htmlFor="data" className="text-3lg">Data limite:</label>
                                    <input
                                        id="data"
                                        type="date"
                                        value={novaTarefa.dataLimite}
                                        onChange={(e) =>
                                            setNovaTarefa({ ...novaTarefa, dataLimite: e.target.value })
                                        }
                                        className="my-2 p-2 w-full border border-gray-300 rounded-lg text-gray-600"
                                    />
                                    <p className="text-sm m-2 mt-4">* Preencha todos os campos</p>

                                    <button type="submit" className="mt-4 px-4 py-2 bg-red-800 text-white 0 rounded hover:bg-white hover:text-red-700">
                                        Adicionar
                                    </button>
                                </form>
                            </div>
                        </div>


                        )}

                    </div>
                </div>
            </div>
        );
}        