# StudyTask — Trabalho final React Native (N2)

App em React Native + Expo + TypeScript para organizar tarefas de estudo.

## Recursos
- 4 telas interativas: Início, Tarefas, Cadastro/Edição, Conselhos.
- CRUD de tarefas com SQLite: criar, consultar, editar, concluir/reabrir e excluir.
- Busca, filtros, prioridade e resumo de tarefas.
- Lembretes locais agendados em data/hora e cancelados ao concluir/excluir.
- Preferência de notificações gravada no AsyncStorage.
- Requisição HTTP à Advice Slip API com carregamento e tratamento de erros.
- Hooks React e componentes reutilizáveis.

## Executar
```bash
npm install
npx expo install --check
npx tsc --noEmit
npx expo start
```
Abra no Android (emulador ou dispositivo). Conceda permissão para notificações ao solicitar.

## Testar
1. Cadastre uma tarefa com título, prioridade e lembrete futuro (formato local `AAAA-MM-DD HH:MM`).
2. Veja-a em Minhas tarefas, filtre e busque pelo título.
3. Edite, marque como concluída/reabra e exclua.
4. Feche o app e abra novamente: as tarefas devem persistir no SQLite.
5. Na tela inicial, teste a notificação de 10 segundos colocando o app em segundo plano.
6. Abra Conselhos e toque em Buscar outro conselho para testar HTTP.
7. Desative e reative lembretes: preferência deve persistir no AsyncStorage.

## Fluxo de branches (Git Flow simplificado)
- `main`: versão estável para entrega.
- `develop`: integração.
- `feature/*`: funcionalidades implementadas por integrantes do grupo, com PRs para `develop`.
- `release/*` e `hotfix/*`: opcional conforme necessidade.

Não inclua `node_modules`, `.expo` ou configurações locais no Git.

## Grupo
- Integrante 1: [nome]
- Integrante 2: [nome]
- Integrante 3: [nome]
- Integrante 4: [nome, se houver]

## Observações
A Advice Slip API fornece conselhos gerais em inglês, não exclusivos de estudo. Dependendo da frequência das chamadas, pode repetir respostas.
