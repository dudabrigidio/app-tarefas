import { TipoTarefa } from "@/types";
import { NextResponse } from "next/server";


export async function GET() {

    //Recuperando os dados da API JAVA
    try {
        const response = await fetch("http://localhost:8080/tarefas/listar");
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Não consegui puxar as tarefas!", error);
        return NextResponse.json({error:"Erro nos dados :" + error});
    }
}

export async function POST(request: Request) {

    //Enviando os dados para API JAVA
    try {
        const body = await request.json();
        const response = await fetch("http://localhost:8080/tarefas/inserir", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro ao criar tarefa!", error);
        return NextResponse.json({error:"Erro ao criar tarefa:" + error});
    }
}

export async function PUT(request: Request) {

    //Enviando os novos dados para API JAVA
    try {
        
        const body : TipoTarefa = await request.json();
        const idTarefa = body.idTarefa;
        const response = await fetch("http://localhost:8080/tarefas/alterar" + {idTarefa}, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro ao alterar tarefa!", error);
        return NextResponse.json({error:"Erro ao alterar tarefa:" + error});
    }
}

export async function DELETE(request: Request) {

    try {
        
        const body : TipoTarefa = await request.json();
        const idTarefa = body.idTarefa;
        const response = await fetch("http://localhost:8080/tarefas/excluir" + {idTarefa}, {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Erro ao alterar tarefa!", error);
        return NextResponse.json({error:"Erro ao alterar tarefa:" + error});
    }
}