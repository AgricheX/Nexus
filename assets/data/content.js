window.AG = window.AG || {};
AG.NML_URL = 'https://github.com/WorldBoxOpenMods/ModLoader';
AG.general = [
  {
    id: 'start', icon: 'book', sec: ['Getting started', 'Começo'], t: ['Which mod is for my game?', 'Qual mod é para o meu jogo?'],
    intro: ['Every mod page shows the game, the game version and the mod loader it needs. Check those three before you download.', 'Toda página de mod mostra o jogo, a versão do jogo e o carregador de mods que ele precisa. Confira esses três antes de baixar.'],
    f: [
      [['New Gen', 'New Gen'], ['Mods for the current version of WorldBox. They run on NML (Neo Mod Loader).', 'Mods para a versão atual do WorldBox. Eles rodam no NML (Neo Mod Loader).']],
      [['Legacy', 'Legacy'], ['Older mods made for WorldBox 0.14 or 0.22 / 0.23. Most of them use NCMS, and they do not run on the current version of the game.', 'Mods antigos feitos para o WorldBox 0.14 ou 0.22 / 0.23. A maioria usa o NCMS, e eles não rodam na versão atual do jogo.']],
      [['RimWorld', 'RimWorld'], ['RimWorld mods go in the RimWorld Mods folder or come from the Steam Workshop, and are turned on in the in-game mod list.', 'Mods de RimWorld vão na pasta Mods do RimWorld ou vêm da Oficina da Steam, e são ativados na lista de mods do jogo.']],
      [['Downloads', 'Downloads'], ['The Download button always gets the latest release straight from GitHub.', 'O botão Baixar sempre pega a versão mais recente direto do GitHub.']]
    ],
    tips: [['Not sure? Ask on Discord and say which version of the game you play.', 'Na dúvida? Pergunte no Discord e diga qual versão do jogo você joga.']]
  },
  {
    id: 'install-worldbox', icon: 'download', sec: ['Getting started', 'Começo'], t: ['Installing a WorldBox mod', 'Instalando um mod de WorldBox'],
    intro: ['After downloading the .zip, the mod goes in the WorldBox Mods folder. You need WorldBox and the mod loader the mod asks for.', 'Depois de baixar o .zip, o mod vai na pasta Mods do WorldBox. Você precisa do WorldBox e do carregador de mods que o mod pede.'],
    f: [
      [['What you need', 'O que você precisa'], ['WorldBox with NML (Neo Mod Loader) for New Gen mods, or NCMS for the Legacy mods that ask for it. The loader is what puts mods into the game.', 'WorldBox com o NML (Neo Mod Loader) para os mods New Gen, ou o NCMS para os mods Legacy que pedem ele. É o carregador que coloca os mods no jogo.']],
      [['Where it goes', 'Onde colocar'], ['On Steam: right-click WorldBox, Manage, Browse local files. Open the Mods folder and extract the .zip inside it.', 'Na Steam: clique com o botão direito em WorldBox, Gerenciar, Navegar pelos arquivos locais. Abra a pasta Mods e extraia o .zip dentro dela.']],
      [['Check the folders', 'Confira as pastas'], ['The mod folder must sit directly inside Mods, with mod.json inside it. Avoid a folder inside a folder of the same name.', 'A pasta do mod deve ficar direto dentro de Mods, com o mod.json dentro dela. Evite uma pasta dentro de outra com o mesmo nome.']],
      [['Keep every file', 'Mantenha todos os arquivos'], ['Extract the whole .zip. Some mods carry .dll files they need to run, so do not delete anything from the folder.', 'Extraia o .zip inteiro. Alguns mods trazem arquivos .dll de que precisam para rodar, então não apague nada da pasta.']],
      [['Turn it on', 'Ative'], ['Open WorldBox. The loader picks the mod up when the game starts, so the first load can take a moment.', 'Abra o WorldBox. O carregador encontra o mod quando o jogo inicia, então a primeira carga pode demorar um pouco.']]
    ],
    tips: [['Test a mod alone first: only the loader and that mod in the Mods folder.', 'Teste um mod sozinho primeiro: só o carregador e esse mod na pasta Mods.']]
  },
  {
    id: 'install-rimworld', icon: 'download', sec: ['Getting started', 'Começo'], t: ['Installing a RimWorld mod', 'Instalando um mod de RimWorld'],
    intro: ['RimWorld mods can come from the Steam Workshop or from the .zip on this site.', 'Mods de RimWorld podem vir da Oficina da Steam ou do .zip deste site.'],
    f: [
      [['Steam Workshop', 'Oficina da Steam'], ['Subscribe on the Workshop page and Steam downloads it for you. Subscribe to the required mods too.', 'Inscreva-se na página da Oficina e a Steam baixa para você. Inscreva-se também nos mods obrigatórios.']],
      [['From the .zip', 'Pelo .zip'], ['Extract it into the Mods folder of your RimWorld installation, so the mod folder has About/About.xml inside it.', 'Extraia na pasta Mods da sua instalação do RimWorld, de forma que a pasta do mod tenha About/About.xml dentro dela.']],
      [['Load order', 'Ordem de carga'], ['Turn the mod on in the mod list and place it after the mods it needs, such as Harmony.', 'Ative o mod na lista de mods e coloque ele depois dos mods de que ele precisa, como o Harmony.']]
    ]
  },
  {
    id: 'not-working', icon: 'shield', sec: ['Problems', 'Problemas'], t: ['The mod does not show up', 'O mod não aparece'],
    intro: ['Most problems come from the folder, the game version or the loader.', 'A maioria dos problemas vem da pasta, da versão do jogo ou do carregador.'],
    f: [
      [['Game version', 'Versão do jogo'], ['Legacy mods do not run on the current WorldBox, and New Gen mods do not run on old versions.', 'Mods Legacy não rodam no WorldBox atual, e mods New Gen não rodam em versões antigas.']],
      [['Loader', 'Carregador'], ['Check that NML or NCMS is installed and up to date.', 'Confira se o NML ou o NCMS está instalado e atualizado.']],
      [['Folder', 'Pasta'], ['Open the mod folder: mod.json (or About/About.xml in RimWorld) must be right there, not one folder deeper.', 'Abra a pasta do mod: o mod.json (ou About/About.xml no RimWorld) tem que estar ali, e não uma pasta mais para dentro.']],
      [['Other mods', 'Outros mods'], ['Remove the other mods for a moment and test this one alone.', 'Tire os outros mods por um momento e teste este sozinho.']]
    ],
    tips: [['Still stuck? Post on Discord with your game version, the mod version and your mod list.', 'Ainda travado? Poste no Discord com a versão do jogo, a versão do mod e sua lista de mods.']]
  },
  {
    id: 'bugs', icon: 'chat', sec: ['Problems', 'Problemas'], t: ['Reporting a bug', 'Reportando um bug'],
    intro: ['Bug reports and questions go to the Agriche Community on Discord.', 'Bugs e dúvidas vão para a Agriche Community no Discord.'],
    f: [
      [['What to send', 'O que mandar'], ['The game version, the mod version, what you did and what happened. A screenshot or the game log helps a lot.', 'A versão do jogo, a versão do mod, o que você fez e o que aconteceu. Um print ou o log do jogo ajuda muito.']],
      [['One bug per post', 'Um bug por post'], ['Separate posts make each bug easier to find and fix.', 'Posts separados deixam cada bug mais fácil de achar e corrigir.']]
    ]
  },
  {
    id: 'free', icon: 'star', sec: ['About', 'Sobre'], t: ['Are the mods free?', 'Os mods são gratuitos?'],
    intro: ['Yes. Every mod here is free, made by fans for fans.', 'Sim. Todos os mods daqui são gratuitos, feitos de fã para fã.'],
    f: [
      [['Scams', 'Golpes'], ['If anyone or any website asks you for money to use them, it is a scam.', 'Se alguém ou algum site pedir dinheiro para usar, é golpe.']],
      [['Official links', 'Links oficiais'], ['This site, the AgricheX GitHub and the Steam Workshop pages linked here are the official places to get them.', 'Este site, o GitHub AgricheX e as páginas da Oficina da Steam linkadas aqui são os lugares oficiais para baixar.']]
    ]
  }
];
