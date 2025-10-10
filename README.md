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

Protagonista: Utilizador Registado

O utilizador cria uma nova _playlist_ para organizar músicas de acordo com  as suas preferências. 
Como pré-condições o utilizador deve estar autenticado no sistema e o catálogo de músicas deve estar disponível. 
O fluxo pode ser resumido da seguinte forma:
O utilizador começa por aceder à secção "Minhas _Playlists_", seleciona a opção "Criar Nova _Playlist_", insere o nome e a descrição da _playlist_, define se a _playlist_ é pública ou privada, pesquisa e adiciona músicas à _playlist_, o sistema guarda a _playlist_ e associa ao perfil do utilizador e por fim a _playlist_ fica disponível para reprodução e edição. Em alternativa, o utilizador também pode adicionar músicas posteriormente e o sistema pode sugerir músicas baseadas no seu histórico.
Como pós-condições: A _playlist_ criada e armazenada é inserida na Base de Dados.

2. Pesquisar e Reproduzir Música

Protagonista: Utilizador (Registado ou Visitante)

O utilizador prrocura uma música específica e inicia a sua reprodução.
Como pré-condições deve aceder à plataforma eo catálago de músicas tem de estar disponível.
O fluxo pode ser resumido da seguinte forma:
Primeiro o utilizador acede à barra de pesquisa, insere o critério de busca (seja o título, artista, álbum ou género), o sistema retorna resultados relevantes em menos de 0.5 segundos depois o utilizador seleciona a música desejada, o sistema verifica o tipo de assinatura do utilizador, a música é adicionada à fila de reprodução, o sistema inicia o _streaming_ da música na qualidade apropriada e por fim regista a reprodução no histórico. Em alternativa, o utilizador sem assinatura _premium_ recebe anúncios e a conexão instável ativará o _buffer_.
Como pós-condições a música deve ser reproduzida, o histórico de audição atualizado e as estatísticas incrementadas consoante.

3. Gerir Assinatura Premium

Protagonista: Utilizador Registado

O utilizador subscreve, atualiza ou cancela ou seu plano de assinatura.
Como pré-condições o utilizador tem de estar autenticado e o sistema de pagamento disponível. O fluxo principal pode ser resumido da seguinte forma:
Primeiro o utilizador acede às configurações da conta, seleciona a opção "Gestão de Assinatura", visualiza os vários planos disponíveis (sejam eles: Individual, Familiar, Estudante ou _Premium_), seleciona o plano desejado, insere informações de pagamento, o sistema processa o pagamento e ativa funcionalidades _premium_ (sejam _downloads offline_, qualidade de áudio _loseless_) e envia confirmação por _email_. Alternativamente caso o pagamento falhe, o sistema deve notificar o utilizador, o utilizador deve poder optar por cancelar uma assinatura existente ou alterar entre planos.
Como pós-condições a assinatura deve poder ser ativada ou modificada, o registo de transações guardado e as funcionalidades atualizadas consoante o plano.

4. Receber Recomendações Personalizadas

Protagonista: Utilizador Registado

O sistema analisa o comportamento do utilizador e gera recomendações musicais personalizadas. Como pré-condições o utilizador tem de ter histórico de audição, um algoritmo de recomendação ativo. O fluxo principal baseia-se no sistema analisar o histórico de reprodução do utilizador, identificar padrões de preferências (géneros, artistas, épocas), analisar _likes/dislikes_ registados, comparar perfil com utilizadores semelhantes, gerir lista de músicas recomendadas, criar _playlist_ "Descoberta Semanal" automaticamente, notificar o utilizador sobre novas recomendações e o utilizador aceder e reproduzir músicas recomendadas. Alternativamente o utilizador pode dar _feedback_ (_like/dislike_) refinando futuras recomendações e o utilizador com pouco histórico deve receber recomendações populares. Como pós-condições deve ter uma _playlist_ de recomendação criada e o sistema aprender com interações futuras.

5. _Download_ de Músicas para Modo Offilne

Protagonista: Utilizador _Premium_

O utilizador deve fazer _download_ de músicas para reprodução sem conexão à _internet_. Como pré-condições o utilizador pode ter assinatura _premium_ ativa, espaço disponível no dispositivo e uma conexão estável à _internet_. O fluxo principal resume-se ao utilizador navegar até música, álbum ou _playlist_, selecionar a opção _"Download"_, o sistema verificar o tipo de assinatura, o espaço disponível no dispositivo e iniciar _download_ na qualidade selecionada pelo utilizador, armazenar ficheiros encriptados (DRM) localmente, registar informação na Base de Dados (seja música, utilizador, dispositivo ou data) e a música deve ficar disponível na secção _"Downloads"_. Alternativamente, o utilizador sem _premium_ é notificado da limitação, caso tenha espaço insuficiente o sistema alerta o utilizador, se o _download_ for interrompido, o sistema retorna automaticamente.
Como pós-condições, a músic deve ficar disponível _offline_, o registo de _download_ armazenado, a contagem de _downloads_ atualizada.

6. Partilhar e Colaborar em Playlist

Protagonista: Utilizador Registado - Criador
Secundário: Utilizador Registado - Colaborador

O utilizador partilha _playlist_ com outros e permite edição colaborativa. Como pré-condições a _playlist_ tem de existir e os utilizadores devem estar registados no sistema. O fluxo principal envolve o criador aceder à _playlist_, selecionar a opção "Partilhar/Colaborar", definir permissões (visualização ou edição), inserir _emails_ ou _usernames_ dos colaboradores, o sistema envia convites, os colaboradores aceitam convite, o sistema concede acesso conforme permissões, os colaboradores podem adicionar ou remover músicas, o sistema notifica todos sobre alterações e o histórico de alterações deve ser registado. Alternativamente, o colaborador recusa o convite, define _playlist_ como pública (acesso a todos), o criador remove permissões de colaborador específico. 
Como pós-condições a _playlist_ deve ser partilhada, os acessoss registados na Base de Dados e as notificações enviadas.

7. Participar em Jam Session

Protagonista: Utilizador Anfitrião
Secundários: Utilizadores Participantes

Os múltiplos utilizadores ouvem música sincronizadamente e em tempo real.
Como pré-condições todos os participantes devem estar autenticados e a conexão à _internet_ deve ser estável. O fluxo envolve que o anfitrião crie uma nova _Jam Session_, defina o nome da sessão e configuração de privacidade, o sistema gere código único da sessão, o anfitrião partilha código com amigos, os participantes inserem o código para entrar, o sistema sincroniza todos os dispositivos, o anfitrião seleciona então música para reproduzir, o sistema transmite música simultaneamente a todos, os participantes podem sugerir próximas músicas e por fim o sistema regista sessão no histórico de todos. Alternativamente o participante sem assinatura deve ter funcionalidades limitadas, o sistema deve permitir votação de músicas, o anfitrião pode transferir controlo a outro participante. 
Como pós-condições a sessão deve ser registada, os históricos atualizados, as estatísticas de audição compartilhada devem ser registadas.

8. Visualizar Estatísticas Anuais

Protagonista: Utilizador Registado

O utilizador acede ao resumo detalhado do seu comportamento de audição anual.
Como pré.condições o utilizador tem de ter histórico de pelo menos 1 mês e os dados de reprodução devem ser armazenados. O fluxo passa pelo utilizador aceder à secção "As Minhas Estatísticas", filtrar/selecionar o período (ano, mês, semana), o sistema agrega dados do histórico de reprodução, calcula tempo total de audição, identifica _top_ 5 artistas mais ouvidos, _top_ 5 músicas mais reproduzidas, determina géneros favotiros por tempo de audição, gera gráficos e visualizações, permite partilha em redes sociais e oferece opção de exportar dados. Alternativamente o utilizador compara com período anterior, escolhe não partilhar e o sistema gera ficheiro JSON/CSV com todos os dados.
Como pós-condições, as estatísticas devem ser apresentadas e deve existir um possível registo de partilha social.

9. Receber Notificação de Novo Lançamento

Protagonista: Sistema de Notificações
Secundário: Utilizador Registado

O sistema notifica utilizador sobre lançamento de álbum de artista favorito. Como pré-condições o utilizador segue artistas, o novo álbum é adicionado ao catálogo. O fluxo envolve que o Administrador ou o Sistema adicionem novo álbum ao catálogo, o Sistema identifica lançamento de artista, consulta Base de Dados para utilizadores que seguem o artista, gera notificações personalizadas, envia notificações _push_ para dispositivos ativos, envia _email_ para utilizadores com preferência ativada e o utilizador clica na notificação, o Sistema redireciona para a página do novo álbum, e é feito o registo de interação com notificação. Alternativamente o utilizador tem notificações desativadas, o utilizador ignora notificação - o sistema regista e adiciona álbuns diretamente à biblioteca.
Como pós-condições as notificações são enviadas, as métricas de _engagement_ registadas e o potencial aumento de reproduções do novo lançamento.

10. Gerir Perfil e Preferências

Protagonista: Utilizador Registado

O utilizador atualiza informações pessoais e configura preferências da plataforma.
Como pré-condição o utilizador tem de estar autenticado.
O fluxo envolve que o utilizador aceda às configurações de perfil, visualize informações atuais (nome, _email_, foto e data de nascimento), seleciona campo a editar, insere novos dados, o Sistema valida informações, atualiza preferências de privacidade, configura notificações (_email_, _push_ e frequência), define qualidade padrão de _streaming_, o Sistema guarda alterações e confirma atualização ao utilizador. Alternativamente se os dados forem inválidos, o Sistema solicita a correção, o utilizador pode solicitar exportação de todos os dados (GPDR) ou solicita a elminação completa da conta.
Como pós-condições o perfil é atualizado na Base de Dados, as preferências serão aplicadas em sessões futuras e o _Log_ de alterações deve ser registado.

**Stakeholders**

1. Utilizadores Finais (Pessoas que utilizam a plataforma para ouvir música)

2. Artistas e Produtores Musicais

3. Gravadores e Editoras

4. Administradores do Sistema

5. Equipa de Marketing e Negócios

6. Investidores e Acionistas

7. Reguladores e Entidades Legais

8. Anunciantes (modelo fremium)

9. Fornecedores de Infraestrutura

10. Desenvolvedores de Terceiros