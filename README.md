# Projeto - Base de Dados de Streaming de Música

## 1. REQUISITOS DE DADOS

### 1.1 Entidades Principais

**Utilizador**
- id_utilizador (INTEGER, PK)
- nome_completo (VARCHAR(100), NOT NULL)
- email (VARCHAR(100), UNIQUE, NOT NULL, formato: user@domain.com)
- data_nascimento (DATE)
- pais (VARCHAR(50))
- data_registo (TIMESTAMP, NOT NULL)
- tipo_assinatura (ENUM: 'Gratuito', 'Individual', 'Familiar', 'Estudante', 'Premium')

**Música**
- id_musica (INTEGER, PK)
- titulo (VARCHAR(200), NOT NULL)
- duracao (TIME, NOT NULL)
- ano_lancamento (INTEGER)
- letra (TEXT)
- numero_reproducoes (INTEGER, DEFAULT 0)
- id_album (INTEGER, FK)

**Artista**
- id_artista (INTEGER, PK)
- nome_artistico (VARCHAR(100), NOT NULL)
- nome_real (VARCHAR(100))
- biografia (TEXT)
- pais_origem (VARCHAR(50))
- data_nascimento (DATE)

**Álbum**
- id_album (INTEGER, PK)
- titulo (VARCHAR(200), NOT NULL)
- data_lancamento (DATE)
- arte_capa (VARCHAR(255))
- id_artista (INTEGER, FK)

**Playlist**
- id_playlist (INTEGER, PK)
- nome (VARCHAR(100), NOT NULL)
- descricao (TEXT)
- publica (BOOLEAN, DEFAULT FALSE)
- data_criacao (TIMESTAMP)
- id_utilizador_criador (INTEGER, FK)

**Género**
- id_genero (INTEGER, PK)
- nome (VARCHAR(50), UNIQUE, NOT NULL)
- descricao (TEXT)

**Podcast**
- id_podcast (INTEGER, PK)
- titulo (VARCHAR(200), NOT NULL)
- descricao (TEXT)
- episodio (INTEGER)
- duracao (TIME)
- data_lancamento (DATE)

**Dispositivo**
- id_dispositivo (INTEGER, PK)
- nome_dispositivo (VARCHAR(100))
- tipo (ENUM: 'Mobile', 'Desktop', 'Tablet', 'Smart TV')
- sistema_operacional (VARCHAR(50))
- id_utilizador (INTEGER, FK)

**Assinatura**
- id_assinatura (INTEGER, PK)
- tipo (ENUM: 'Individual', 'Familiar', 'Estudante', 'Premium')
- preco (DECIMAL(10,2), NOT NULL)
- data_inicio (DATE, NOT NULL)
- data_fim (DATE)
- id_utilizador (INTEGER, FK)

**Histórico_Audição**
- id_historico (INTEGER, PK)
- id_utilizador (INTEGER, FK)
- id_musica (INTEGER, FK)
- id_dispositivo (INTEGER, FK)
- data_hora_reproducao (TIMESTAMP, NOT NULL)
- duracao_ouvida (TIME)
- concluida (BOOLEAN)

**Qualidade_Audio**
- id_qualidade (INTEGER, PK)
- id_musica (INTEGER, FK)
- nivel_qualidade (ENUM: 'Baixa', 'Média', 'Alta', 'Lossless')
- bitrate (INTEGER)
- tamanho_ficheiro (INTEGER)
- caminho_ficheiro (VARCHAR(255))

### 1.2 Relacionamentos

- Um **Utilizador** pode criar múltiplas **Playlists** (1:N)
- Uma **Playlist** pode conter múltiplas **Músicas** (N:M)
- Uma **Música** pertence a um **Álbum** (N:1)
- Um **Álbum** é criado por um **Artista** (N:1)
- Uma **Música** pode ter múltiplos **Géneros** (N:M)
- Um **Artista** pode colaborar em múltiplas **Músicas** (N:M)
- Um **Utilizador** pode ter múltiplos **Dispositivos** registados (1:N)
- Um **Utilizador** tem um **Histórico_Audição** (1:N)
- Uma **Música** pode ter múltiplas versões de **Qualidade_Audio** (1:N)

### 1.3 Restrições de Integridade

- O email do utilizador deve ser único e seguir o formato válido (user@domain.com)
- Não podem existir duas reservas para a mesma playlist com o mesmo nome pelo mesmo utilizador
- O número de reproduções não pode ser negativo
- A data de fim da assinatura deve ser posterior à data de início
- A duração ouvida no histórico não pode exceder a duração total da música
- Cada música deve pertencer a pelo menos um género
- O bitrate da qualidade de áudio deve ser positivo

---

## 2. REQUISITOS FUNCIONAIS

### 2.1 Gestão de Utilizadores

**RF01** - O sistema deve permitir o registo de novos utilizadores com email e palavra-passe

**RF02** - O sistema deve autenticar utilizadores através de credenciais válidas

**RF03** - O sistema deve permitir aos utilizadores editar informações do perfil (nome, email, país, foto)

**RF04** - O sistema deve permitir aos utilizadores eliminar completamente a sua conta

**RF05** - O sistema deve permitir aos utilizadores exportar todos os seus dados pessoais (conformidade GDPR)

### 2.2 Gestão de Conteúdo Musical

**RF06** - O sistema deve permitir pesquisar músicas por título, artista, álbum ou género

**RF07** - O sistema deve permitir pesquisar artistas por nome ou país de origem

**RF08** - O sistema deve permitir pesquisar álbuns por título, artista ou ano de lançamento

**RF09** - O sistema deve permitir aos utilizadores reproduzir músicas do catálogo

**RF10** - O sistema deve registar cada reprodução no histórico do utilizador

### 2.3 Gestão de Playlists

**RF11** - O sistema deve permitir aos utilizadores criar playlists personalizadas

**RF12** - O sistema deve permitir aos utilizadores adicionar e remover músicas de playlists

**RF13** - O sistema deve permitir aos utilizadores partilhar playlists com outros utilizadores

**RF14** - O sistema deve permitir edição colaborativa de playlists partilhadas

**RF15** - O sistema deve permitir definir playlists como públicas ou privadas

### 2.4 Sistema de Favoritos e Preferências

**RF16** - O sistema deve permitir aos utilizadores marcar músicas como favoritas (like/dislike)

**RF17** - O sistema deve permitir aos utilizadores seguir artistas

**RF18** - O sistema deve permitir aos utilizadores guardar álbuns na biblioteca pessoal

### 2.5 Downloads Offline

**RF19** - O sistema deve permitir aos utilizadores premium fazer download de músicas para audição offline

**RF20** - O sistema deve verificar o tipo de assinatura antes de permitir downloads

**RF21** - O sistema deve registar informações sobre downloads (música, utilizador, dispositivo, data)

### 2.6 Recomendações e Descoberta

**RF22** - O sistema deve gerar playlists recomendadas baseadas no histórico de audição do utilizador

**RF23** - O sistema deve recomendar músicas baseadas em likes/dislikes por género

**RF24** - O sistema deve sugerir artistas similares aos favoritos do utilizador

### 2.7 Notificações

**RF25** - O sistema deve notificar utilizadores sobre lançamentos de álbuns de artistas seguidos

**RF26** - O sistema deve permitir aos utilizadores configurar preferências de notificações (email, push)

### 2.8 Estatísticas e Análise

**RF27** - O sistema deve calcular e apresentar tempo total de audição (anual, mensal, semanal)

**RF28** - O sistema deve identificar e apresentar os top 5 artistas mais ouvidos por utilizador

**RF29** - O sistema deve identificar e apresentar as top 5 músicas mais reproduzidas por utilizador

**RF30** - O sistema deve determinar géneros favoritos baseados em tempo de audição

**RF31** - O sistema deve permitir aos utilizadores exportar estatísticas de audição

### 2.9 Funcionalidades Sociais

**RF32** - O sistema deve permitir criar jam sessions para audição sincronizada entre múltiplos utilizadores

**RF33** - O sistema deve gerar códigos únicos para acesso a jam sessions

**RF34** - O sistema deve sincronizar reprodução entre todos os participantes de uma jam session

### 2.10 Gestão de Assinaturas

**RF35** - O sistema deve permitir aos utilizadores subscrever planos pagos (Individual, Familiar, Estudante, Premium)

**RF36** - O sistema deve processar pagamentos de assinaturas

**RF37** - O sistema deve permitir aos utilizadores alterar ou cancelar assinaturas

**RF38** - O sistema deve ativar/desativar funcionalidades conforme tipo de assinatura

### 2.11 Sincronização Multi-dispositivo

**RF39** - O sistema deve sincronizar estado de reprodução entre dispositivos do mesmo utilizador

**RF40** - O sistema deve permitir aos utilizadores registar múltiplos dispositivos

**RF41** - O sistema deve permitir continuar reprodução no ponto exato onde foi pausada em outro dispositivo

### 2.12 Suporte a Podcasts

**RF42** - O sistema deve permitir pesquisar e reproduzir podcasts

**RF43** - O sistema deve permitir aos utilizadores subscrever podcasts

### 2.13 Gestão de Fila de Reprodução

**RF44** - O sistema deve permitir aos utilizadores adicionar músicas à fila de reprodução

**RF45** - O sistema deve permitir reordenar músicas na fila de reprodução

**RF46** - O sistema deve permitir remover músicas da fila de reprodução

### 2.14 Letras de Músicas

**RF47** - O sistema deve exibir letras sincronizadas durante a reprodução (quando disponíveis)

**RF48** - O sistema deve permitir pesquisar músicas por trechos de letra

---

## 3. REQUISITOS NÃO-FUNCIONAIS

### 3.1 Desempenho

**RNF01** - O tempo de resposta para pesquisas de músicas, artistas ou álbuns deve ser inferior a 0,5 segundos em 95% dos casos

**RNF02** - O início da reprodução de áudio deve ocorrer em menos de 1 segundo após a seleção

**RNF03** - O buffer de reprodução deve prevenir interrupções em conexões com velocidade mínima de 1,5 Mbps

**RNF04** - As operações de criação e edição de playlist não devem ultrapassar 2 segundos

**RNF05** - O tempo de carregamento entre páginas ou secções deve ser inferior a 2 segundos

### 3.2 Escalabilidade

**RNF06** - O sistema deve suportar um aumento de até 25% por mês na base de utilizadores sem degradação de desempenho

**RNF07** - A base de dados deve estar preparada para suportar um catálogo de pelo menos 50 milhões de faixas

**RNF08** - O sistema deve ter capacidade para lidar com picos de acesso de até 80% dos utilizadores simultâneos durante lançamentos de artistas populares

**RNF09** - O sistema deve suportar até 100.000 utilizadores concorrentes sem degradação significativa

### 3.3 Disponibilidade e Confiabilidade

**RNF10** - O sistema deve estar disponível 99,9% do tempo (downtime máximo de 8,76 horas por ano)

**RNF11** - Recuperação automática após falhas em menos de 5 minutos

**RNF12** - Em caso de falha do sistema não pode haver qualquer perda ou fuga de dados

**RNF13** - O tempo de recuperação de dados em caso de falha deve ser inferior a 2 horas

### 3.4 Segurança

**RNF14** - Todas as transmissões de dados devem ser criptografadas usando TLS 1.3 ou superior

**RNF15** - As palavras-passe dos utilizadores devem ser armazenadas usando hashing seguro (bcrypt, Argon2)

**RNF16** - O sistema deve implementar proteção contra ataques comuns (SQL injection, XSS, CSRF)

**RNF17** - O sistema deve implementar proteção contra reprodução não autorizada (DRM)

**RNF18** - Apenas utilizadores autenticados podem aceder a funcionalidades do sistema

**RNF19** - O sistema deve implementar controle de acesso baseado em perfis de utilizador

**RNF20** - Dados biométricos (quando utilizados) devem ser armazenados em formato encriptado

### 3.5 Usabilidade

**RNF21** - A interface deve ser intuitiva, permitindo que novos utilizadores realizem tarefas básicas sem treino prévio

**RNF22** - O design deve ser responsivo para adaptação a diferentes tamanhos de ecrã (mobile, tablet, desktop)

**RNF23** - A acessibilidade deve seguir os padrões WCAG 2.1 nível AA

**RNF24** - O sistema deve suportar múltiplos idiomas (português e inglês no mínimo)

### 3.6 Manutenibilidade

**RNF25** - Atualizações do sistema não devem interromper o serviço por mais de 10 minutos

**RNF26** - A documentação do código e da arquitetura da base de dados deve ser completa

**RNF27** - O sistema deve ter modularidade suficiente para permitir substituição de componentes sem afetar o todo

**RNF28** - Procedimentos de recuperação de desastres devem estar documentados

### 3.7 Compatibilidade

**RNF29** - O sistema deve funcionar nos principais navegadores (Chrome, Firefox, Safari, Edge) nas versões atuais

**RNF30** - O sistema deve ser compatível com dispositivos móveis (iOS 14+ e Android 10+)

**RNF31** - As APIs devem estar documentadas para integração com sistemas de terceiros

### 3.8 Privacidade e Conformidade Legal

**RNF32** - O sistema deve estar em total conformidade com GDPR, LGPD e outras legislações de proteção de dados

**RNF33** - O sistema deve permitir aos utilizadores exportar todos os seus dados em formato legível (JSON/CSV)

**RNF34** - O sistema deve permitir aos utilizadores solicitar eliminação completa dos seus dados

**RNF35** - O sistema deve registar o consentimento do utilizador para recolha e uso de dados

**RNF36** - O sistema deve manter logs de auditoria de acessos a dados sensíveis

### 3.9 Backup e Recuperação

**RNF37** - Backups automáticos diários devem ser realizados com retenção de 30 dias

**RNF38** - O sistema deve ter procedimentos de backup incremental a cada 6 horas

**RNF39** - Testes de recuperação de backup devem ser realizados mensalmente

### 3.10 Eficiência

**RNF40** - Os recursos do servidor devem ser otimizados para minimizar custos operacionais

**RNF41** - O sistema deve realizar compressão de dados para reduzir uso de largura de banda

**RNF42** - Consultas à base de dados devem ser otimizadas através de índices apropriados

**RNF43** - O cliente móvel não deve consumir mais de 5% de bateria por hora de reprodução

# Projeto - Base de Dados de Streaming de Música

**Requisitos Funcionais:**

çamentos de albuns dos artistas favoritos.

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

- Tempo de resposta para pesquisas inferior a 0.5 segundos

- Buffer de reprodução impede interrupções em conexões com velocidade mínima de 1.5 Mbps

_Escalabilidade_

- O sistema deve suportar um aumento de até 25% por mês na base dos utilizadores sem compromissos de desempenho

- A base de dados deve estar preparada para suportar um catáçogo de pelo menos 50 milhões de faixas

- Tem de ter a capacidade de lidar com picos de acesso de até 80% dos utilizadores simultâneos durante lançamentos de artistas populares

_Confiabilidade_

- O sistema deve estar disponível 99.9% do tempo com downtime máximo de 8.75 horas por ano para eventuais manutenções de qualidade

- Em caso de falha do sistema não poderá haver qualquer perda ou fuga de dados

_Segurança_
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

- Notificações sobre lan
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

**Cenários de Uso**

- Audição pessoal em casa, trabalho ou em movimento
- Sessões de descoberta musical para encontrar novos conteúdos
- Partilha social de _playlists_ e preferências musicais
- Gestão de biblioteca pessoal com organização de favoritos
- Acesso _offline_ em situações sem conectividade

**Características Técnias**

- _Streaming_ em tempo real com _buffer_ adaptativo
- Compressão de dados otimizada para diferentes larguras de banda
- Sincronização de estado entre vários dispositivos
- Interrupção contextual quando outras aplicações de áudio são iniciadas
- Conformidade com DRM (direitos autorais)

Requisitos de Negócio: Objetivos principais

1. Proporcionar acesso ilimitado a um vasto catálogo musical
2. Criar experiências personalizadas através de recomendações inteligentes
3. Facilitar a descobreta de novos artistas e géneros
4. Construir comunidades em torno de interesses musicais partilhados
5. Monetizar através de subscrições escalonadas

**Desafios do Domínio**

- Gestão de um catálogo massivo (50+ milhões de faixas)
- Processamento de alto volume de dados de audição em tempo real
- Garantia de disponibilidade contínua (99.9% _uptime_)
- Protação de direitos autorais e gestão de licenciamento
- Escalabilidade para suportar picos de acesso simultâneo
- Conformidade com regulamentações de privacidade (GPDR, LGPD)

Valor para Utilizadores:

A plataforma oferece:

- Conveniência: acesso instantâneo a milhões de músicas
- Personalização: experiência adaptada aos gosstos individuais
- Descoberta: ferramentas para encontrar nova música
- Portabilidade: acesso em qualquer dispositivo
- Organização: ferramentas para gerir a biblioteca pessoal
- Partilha: funcionalidades sociais para conectar com outros

Este domínio representa convergência entre tecnologia, entretenimento e análise de dados, proporcionando uma experiência musical rica, personalizada e acessível a uma vasta base de utilizadores.

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

**Stakeholders Primários**

1. Utilizadores Finais

Pessoas que utilizam a plataforma para ouvir música
Podem incluir utilizadores gratuitos (limitações como anúncios ou qualidade reduzida), utilizadores _premium_ (subscritores que pagam por funcionalidades avançadas), utilizadores estudantes (plano com desonto para estudantes verificados) e utilizadores familiares (grupo de até 6 pessoas partilham a assinatura). Interesses incluem o acesso rápido e fácil a um vasto catálogo musical, recomendações personalizadas de qualidade, experiência sem interrupções, privacidade e segurança dos dados e sincronização entre dispositivos. O impacto é alto - são o _core_ do negócio.

2. Artistas e Produtores Musicais

Criadores de conteúdo cujas obras estão disponíveis na plataforma.
Interesses incluem distribuição ampla das suas obras, compensação justa por reproduções, estatísticas detalhadas de audição, promoção e descoberta por novos fãs, proteção de direitos autorais. O impacto é alto, pois fornecem o conteúdo essencial.

3. Gravadores e Editoras

Empresas detentoras dos direitos de distribuição musical.
Interesses incluem os acordos de licenciamento lucrativos, o controlo sobre o catálog disponibilizado, métricas de _performance_ das obras, proteção contra pirataria (DRM) e maximização de receitas. O impacto é alto e controlam acesso ao catálogo.

**Stakeholders Secundários**

4. Administradores do Sistema

Equipa técnica responsável pela gestão da plataforma.
Interesses são um Sistema estável e escalável, ferramentas de monitorização eficientes, documentação completa, facilidade de manutenção e _backup_ e recuperação de dados. O impacto é médio-alto e garantem funcionamento contínuo.

5. Equipa de Marketing e Negócios

Responsáveis por aquisição de utilizadores e parcerias.
Interesses incluem dados analísitocs sobre comportamento dos utilizadores, métricas de conversão (gratuito -> _premium_), ferramentas de campanhas promocionais, relatórios de crescimento e integração com redes sociais. O impacto é médio (impulsionam o crescimento do negócio).

6. Investidores e Acionistas

Financiadores e proprietários parciais da plataforma.
Interesses incluem o retorno sobre investiimento, crescimento sustentável da base de utilizadores, redução de custos operacionais, vantagem competitiva no mercado e conformidade legal e regulatória. O. impacto é médio (influenciam decisões estratégicas).

7. Reguladores e Entidades Legais

Organizações governamentais e de supervisão. Os subgrupos são Autoridades de Proteção de Dados (CNPD - Portugal e GPDR - UE), Organizações de Direitos Autorais (SPA, Audiogest) e Autoridades de Concorrência. Como interesses tem a conformidade com GPDR/LGPD, a proteção de direitos de autor, as práticas comerciais justas, a proteção do consumidor e a tributação adequada. O impacto é médio (estabelecem requisitos legais obrigatórios)

8. Anunciantes (modelo fremium)

Empresas que pagam para exibir anúncios a utilizadores gratuitos. Tem como interesses a segmentação eficaz do público-alvo, métricas de visualização e _engagement_, ROI mensurável e formatos publicitários não intrusivos. O impacto é baixo-médio (fonte de receita complementar)

9. Fornecedores de Infraestrutura

Provedores de serviços _cloud_, CDN e armazenamento. Os subgrupos são os serviços _cloud_ (AWS, Google Cloud e Azure), CDN (Content Delivery Networks) e Fornecedores de soluções de _streaming_. Como interesses tem os contratos de longo prazo, o uso consistente e previsível de recursos e o _feedback_ sobre _performance_. O impacto é baixo-médio (viabilizam a infraestrutura técnica).

10. Desenvolvedores de Terceiros

Programadores que criam integrações usando APIs da plataforma. Como interesses tem APIs bem documentadas e estáveis, SDKs em múltiplas linguagens, _Sandboxes_ para testes e suporte técnico responsivo. O impacto é baixo (expandem ecossistema da plataforma).

Resumindo:

**Alto Poder, Alto Interesse:**

- Utilizadores _Premium_
- Gravadoras
- Investidores

**Alto Poder, Baixo Interesse:**

- Reguladores
- Fornecedores de Infraestrutura

**Baixo Poder, Alto Interesse:**

- Artistas Independentes
- Utilizadores Gratuitos
- Desenvolvedores de Terceiros

**Baixo Poder, Baixo Interesse:**

- Anunciantes

Com esta identificação, é possível priorizar requisitos e comunicação conforme o impacto e interesse de cada grupo.