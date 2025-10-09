# Projeto - Base de Dados de Streaming de Música

**Requisitos Funcionais:**

O que precisa de fazer? / Que ações deve suportar / A Base de Dados suporta ou não os requisitos?

- Criar playlists

- Pesquisar álbuns

- Suportar múltiplos utilizador

- Tempo de música ouvido no ano

- Analisar dados (fazer consultas às várias tabelas)

- Download de músicas (gerenciar reprodução das músicas baixadas)

- Pesquisar música

- Pesquisar artista

- Criar playlists recomendada com base no hisórico de audição

- Estatísticas (artistas mais ouvidos e géneros favoritos)

- Gerenciar o perfil (dados pessoais)

- Tempo de audição por música de cada artista

- Selecionar músicas favoritas (dar like/dislike)

- A partir de likes em cada género recomendar músicas desse género

- Notificações sobre lançamentos de albuns dos artistas favoritos.

- Inserir músicas por artista

- Atualizar Tempo de Audição Semanal

- Suporta podcasts

- Cross-sync entre dispositivos

- Acesso de várias pessoas à mesma playlists

- Jam session entre utilizadores

- Suporte a vários níveis de qualidade de áudio

- Controlos da fila de reprodução

- Suporte a letras de músicas

- Gerenciamento de assinaturas pagas

**Requisitos Não-Fucnionais**

_Desempenho_

- Tempo de resposta para pesquisas inferior a 0.5

- Buffer de reprodução impede interrupções em conexões com velocidade mínima de 1.5 Mbps

_Escalabilidade_

- O sistema deve suportar um aumento de até 25% por mês na base dos utilizadores sem compromissos de desempenho

- A base de dados deve estar preparada para suportar um catáçogo de pelo menos 50 milhões de faixas

- Tem de ter a capacidade de lidar com picos de acesso de até 80% dos utilizadores simultâneos durante lançamentos de artistas populares

_Confiabilidade_

- O sistema deve estar disponível 99.9% do tempo com downtime máximo de 8.75 horas por ano para eventuais manutenções de qualidade

- Em caso de falha do sistema não poderá haver qualquer perda ou fuga de dados

_Segurança_

- Proteção contra reprodução não autorizada que coloque em causa os direitos de autor (DRM)

- Armazenamento dos dados biométricos na Base de Dados

- Apenas assinantes poderão modificar a sua informação sobre o planto que utilizam

_Usabilidade_

- O tempo de carregamento entre páginas ou secções deve ser inferior a 2 segundos

- Acessibilidade deve seguir os padrões mais reentes (WCAG ou W3C)

- O design deve ser responsivo para adaptação aos mais variados tamanhos de ecrã

- Interrupção contextual: pausar automaticamente a reprodução quando outras fontes de áudio/vídeo são ativadas no dispositivo

_Manutenção_

- Atualizações do sistema não devem interromper o serviço por mais de 10 minutos

- A documentação do código e da arquitetura da Base de Dados tem de ser completa e descritiva o suficiente

- Tem de ter modularidade, ou seja, possibilitar a substituição de partes do sistema sem o afetar como um todo

_Compatibilidade_

- Todas as APIs deverão estar documentadas para a integração com sistemas de terceiros

_Privacidade e Conformidade Legal_

- A Base de Dados tem de estar em total conformidade com GPDR, LGPD e outras legislações de proteção de dados

- O utilizador deve ser capaz de exportar ou eliminar inteiramente os seus dados pessoais sempre que o solicitar

- A Base de Dados não deve guardar dados sem o registo do consentimento para recolha e uso dos dados por parte de quem utilizar o serviço

- Diariamente deve ser solicitado um backup dos dados com retenção de 30 dias

- O tempo de recuperação dos dados em caso de falha deve ser inferior a 2 horas

- Os procedimentos de recuperação de falhas do sistema tem de estar documentado

_Eficiência_

- Os recursos do servidor devem ser otimizados

- Deve ser realizada a compressão dos dados para reduzir o uso de largura de banda

**Descrição Detalhada do Domínio de Aplicação**

A plataforma de streaming de música é um sistema digital abrangente que permite aos utilizadores aceder, organizar e reproduzir conteúdo musical através da Internet. Este domínio de aplicação engloba a gestão de um vasto catálogo de conteúdo áudio, perfis de utilizadores, sistemas de recomendação personalizados e funcionalidades sociais de partilha musical.

**1. Biblioteca de Músicas e Álbuns**

- **Músicas individuais** com metadados completos (título, duração, ano de lançamento, letra, genéro)

- **Álbuns** organizados por artistas, com informação sobre data de lançamento e arte de capa

- **Artistas** com biografias, discografias e informações sobre colaborações

- **Géneros musicais** para categorização e descoberta de conteúdo

- **Podcasts** como extensão do conteúdo áudio disponível

- Suporte para múltiplos níveis de qualidade de áudio (baixa, média, alta, *lossless*)

**2. Sistema de Utilizadores e Playlists**

O sistema centra-se na experiência personalizada do utilizador através de:

- **Perfis individuais** com dados pessoais,
preferências musicais e histórico de audição

- **Playlists personalizadas** criadas pelos utilizadores

- **Playlists recomendadas** geradas automaticamente com base no histórico e preferências

- **Sistema de favoritos** (like/dislike) para músicas, álbuns e artistas

- **Sincronização multi-dispositivo** que permite continuidade da experiência em diferentes plataformas

- **Jam sessions** - funcionalidade social que permite a múltiplos utilizadores ouvirem música sincronizadamente

**3. Sistema de Subscrições**

Modelo de negócio baseado em diferentes níveis de acesso:

- **Assinaturas pagas** com diferentes planos (Individual, Familiar, Estudante, Premium)

- **Gersão de períodos de subscrição** (data de início, renovação, cancelamento)

- **Controlo de funcionalidades** por tipo de assinatura

- **Download offline** disponível apenas para subscritores premium

- **Qualidade de áudio diferenciada** conforme o plano

**4. Recomendações Personalizadas**

Sistema inteligente de sugestões baseado em:

- **Análise do histórico de audição** individual

- **Padrões de preferências** por género, artista e época

- **Sistema de likes/dislikes** em músicas e géneros

- **Descoberta de novos artistas** similares aos favoritos do utilizador

- **Notificações de lançamentos** de artistas seguidos pelo utilizador

- **Algoritmos de machine learning** para melhorar continuamente as recomendações

**5. Estatísticas de Reprodução**

Análise detalhada do comportamento de audição:

- **Tempo total de audição** (anual, mensal e semanal)

- **Artistas mais ouvidos** com rankings personalizados

- **Géneros favoritos** baseados em tempo de audição

- **Músicas mais reproduzidas** individual e globalmente

- **Histórico completo de reprodução** com timestamps e dispositivo utilizado

- **Estatística comparativas** (ex: "Top 1% de ouvintes de um artista")

**Casos de Uso Principais**

1. Criar Playlist Personalizada

2. Pesquisar e Reproduzir Música

3. Gerir Assinatura Premium

4. Receber Recomendações Personalizadas

5. Download de Músicas para Modo Offilne

6. Partilhar e Colaborar em Playlist

7. Participar em Jam Session

8. Visualizar Estatísticas Anuais

9. Receber Notificação de Novo Lançamento

10. Gerir Perfil e Preferências

**Stakeholders**

1. Utilizadores Finais

2. Artistas e Produtores Musicais

3. Gravadores e Editoras

4. Administradores do Sistema

5. Equipa de Marketing e Negócios

6. Investidores e Acionistas

7. Reguladores e Entidades Legais

8. Anunciantes (modelo fremium)

9. Fornecedores de Infraestrutura

10. Desenvolvedores de Terceiros