import { redirect } from 'next/navigation';


export default function Home() {

  redirect('/tarefas')
  return (
    <div>
    </div>
  );
}
