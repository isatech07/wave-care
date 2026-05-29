"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import styles from "./page.module.css";

export default function PedidoConfirmado() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <CheckCircle size={80} className={styles.icon} />
        </div>
        
        <h1 className={styles.title}>Pedido Confirmado!</h1>
        
        <p className={styles.message}>
          Seu pedido foi criado com sucesso e está sendo processado.
          Você receberá atualizações sobre o status do seu pedido.
        </p>
        
        <p className={styles.subMessage}>
          Redirecionando para a página inicial em 5 segundos...
        </p>
        
        <button
          onClick={() => router.push("/")}
          className={styles.button}
        >
          Voltar para a página inicial
        </button>
      </div>
    </div>
  );
}
