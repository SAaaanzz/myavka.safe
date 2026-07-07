// Тема и язык: сохраняются в localStorage
const I18N = {
  ru: {
    "nav.home": "Главная",
    "nav.catalog": "Каталог",
    "nav.chats": "Чаты",
    "nav.blacklist": "Чёрный список",
    "nav.faq": "FAQ",
    "nav.login": "Войти через Telegram",
    "footer.copy": "© 2026 Myavka.safe — все права защищены",
    "footer.tagline": "Гарант-сервис безопасных онлайн-сделок. Казахстан, СНГ.",
    "footer.service": "Сервис",
    "footer.help": "Помощь",
    "footer.rules": "Правила сервиса",
    "footer.offer": "Оферта",
    "footer.contacts": "Контакты",
    "footer.bot": "Telegram-бот",
    "footer.news": "Канал новостей",

    "hero.badge": "Эскроу-сервис · Казахстан и СНГ",
    "hero.title": "Сделки без риска —<br />деньги под защитой <span class=\"safe\">Myavka.safe</span>",
    "hero.lead": "Мы удерживаем оплату покупателя до выполнения обязательств продавцом. Вход через Telegram, оплата через Kaspi, администраторы на связи круглосуточно.",
    "hero.openCatalog": "Открыть каталог",
    "hero.howDeal": "Как проходит сделка",
    "hero.stat1": "успешных сделок",
    "hero.stat2": "сделок без споров",
    "hero.stat3": "администраторы онлайн",
    "hero.stat4n": "до 5 мин",
    "hero.stat4": "ответ администратора",

    "how.title": "Как это работает",
    "how.sub": "Четыре шага — и сделка под защитой эскроу",
    "how.s1t": "Договоритесь",
    "how.s1": "Найдите лот в каталоге или создайте сделку с контрагентом напрямую.",
    "how.s2t": "Оплата в эскроу",
    "how.s2": "Покупатель оплачивает через Kaspi — деньги замораживаются на счёте гаранта.",
    "how.s3t": "Передача товара",
    "how.s3": "Продавец передаёт товар или выполняет услугу прямо в чате сделки.",
    "how.s4t": "Деньги продавцу",
    "how.s4": "Покупатель подтверждает получение — гарант переводит деньги продавцу.",

    "why.title": "Почему нам доверяют",
    "why.sub": "Максимальная защита каждой стороны сделки",
    "why.c1t": "Вход только через Telegram",
    "why.c1": "Никаких паролей. Номер телефона контрагента виден — вы знаете, с кем имеете дело.",
    "why.c2t": "Оплата через Kaspi",
    "why.c2": "Привычный способ оплаты для Казахстана. Деньги заморожены до завершения сделки.",
    "why.c3t": "Администратор в чате",
    "why.c3": "В любой момент вызовите администратора для контроля сделки или разрешения спора.",
    "why.c4t": "IP-безопасность",
    "why.c4": "Автоматическая приостановка сделки при подозрительной смене IP-адреса участника.",
    "why.c5t": "Чёрный список",
    "why.c5": "Открытая база мошенников — проверьте контрагента по Telegram, телефону или Kaspi.",
    "why.c6t": "Верификация продавцов",
    "why.c6": "Продажа аккаунтов — только для продавцов, подтвердивших личность документами.",

    "plat.title": "Каталог платформ",
    "plat.sub": "Выберите игру → категорию услуги → лот продавца",
    "plat.all": "Весь каталог",
    "plat.allDesc": "Все игры и платформы. Не нашли свою? Предложите — добавим",
    "plat.go": "Перейти в каталог →",

    "price.title": "Тарифы",
    "price.sub": "Прозрачная комиссия — платите только за успешные сделки",
    "price.std": "Стандарт",
    "price.stdMin": "минимум 500 ₸",
    "price.f1": "Эскроу-защита средств",
    "price.f2": "Чат сделки",
    "price.f3": "Открытие спора",
    "price.f4": "Уведомления в Telegram",
    "price.create": "Создать сделку",
    "price.admin": "С администратором",
    "price.adminFee": "+ 500 ₸ за вход админа",
    "price.a1": "Всё из тарифа «Стандарт»",
    "price.a2": "Администратор в чате",
    "price.a3": "Контроль каждого шага",
    "price.a4": "Изменение данных сделки",
    "price.vip": "VIP-продавец",
    "price.vipFee": "от 5 000 ₸/мес",
    "price.v1": "Пониженная комиссия",
    "price.v2": "Выделение в каталоге",
    "price.v3": "3 продвижения в месяц",
    "price.v4": "Персональный менеджер",
    "price.connect": "Подключить",

    "cta.title": "Готовы к безопасной сделке?",
    "cta.sub": "Войдите через Telegram и создайте первую сделку за минуту",

    "cat.title": "Каталог",
    "cat.sub": "Выберите сервис или сразу нужную услугу",
    "cat.searchPh": "Поиск по всему каталогу — например, «алмазы Mobile Legends»",
    "cat.createLot": "+ Создать лот",

    "lots.searchPh": "Поиск в этой категории",
    "lots.sortPop": "Сортировка: популярные",
    "lots.sortAsc": "Цена: по возрастанию",
    "lots.sortDesc": "Цена: по убыванию",
    "lots.sortRate": "Рейтинг продавца",
    "lots.priceFrom": "Цена от, ₸",
    "lots.priceTo": "Цена до, ₸",
    "lots.online": "Онлайн",
    "lots.verified": "Верифицирован",
    "lots.escrow": "Каждая покупка защищена эскроу.",
    "lots.empty": "В этой категории пока нет лотов — станьте первым продавцом!",
    "lots.userLots": "Объявления пользователей",

    "bl.title": "Чёрный список",
    "bl.sub": "Проверьте контрагента перед сделкой — по Telegram, номеру телефона или Kaspi",
    "bl.searchPh": "@username, Telegram ID, +7 700 …, или номер Kaspi",
    "bl.check": "Проверить",
    "bl.recent": "Последние записи",
    "bl.date": "Дата",
    "bl.id": "Идентификатор",
    "bl.reason": "Причина",
    "bl.status": "Статус",

    "faq.title": "Частые вопросы",
    "faq.sub": "Всё о работе гаранта Myavka.safe",

    "chats.title": "Чаты",
    "chats.sub": "Переписка с покупателями и продавцами",
    "chats.inputPh": "Написать сообщение…",
    "chats.send": "Отправить",
    "chats.online": "онлайн",
    "chats.offline": "не в сети",
    "chats.paidBanner": "Клиент оплатил заказ",
    "chats.inEscrow": "в эскроу",
    "chats.notifTitle": "Клиент оплатил заказ",
    "chats.goChat": "Перейти в чат",
    "chats.you": "Вы",
    "chats.noMsgs": "Нет сообщений",
    "chats.empty": "Сообщений пока нет — напишите первым!",
    "chats.tooLarge": "Файл слишком большой — максимум 5 МБ",
    "chats.banned": "Ваш аккаунт заблокирован до решения администратора. Ожидайте, когда администратор свяжется с вами.",
    "chats.finishDeal": "Завершить сделку",
    "chats.accIdPrompt": "Введите ID проданного аккаунта для проверки по бан-базе:",
    "chats.dealDone": "Сделка завершена. Аккаунт чист — в бан-базе не числится.",
    "chats.dealFlagged": "⚠️ Аккаунт числится в бан-базе (украден/возвращён)! Администратор уведомлён и разберётся в ситуации.",

    "auth.title": "Вход через Telegram",
    "auth.lead": "Чаты и создание лотов доступны только зарегистрированным. Откройте бота @myavka_safe_bot, нажмите Start — он пришлёт кнопку «Войти на сайт», по ней вы попадёте сюда уже в своём профиле.",
    "auth.tgBtn": "Открыть бота в Telegram",
    "auth.expired": "Ссылка входа устарела — запросите новую в боте командой /login",
    "auth.cancel": "Отмена",
    "auth.logout": "Выйти из аккаунта?",
    "auth.errNet": "Ошибка сети, попробуйте ещё раз",

    "promo.s1t": "Донат алмазов<br />за 30 минут",
    "promo.s1": "Официальный донат на ваш ID под защитой эскроу",
    "promo.s2t": "Premium и Stars<br />без переплат",
    "promo.s2": "Подарком через Fragment — активация за 10 минут",
    "promo.s3t": "UC по лучшему<br />курсу",
    "promo.s3": "Зачисление через ID за 15 минут, гарантия сервиса",
    "home.stats": "Статистика сервиса",
    "footer.support": "Поддержка",
    "chats.verified": "Пользователь верифицирован",
    "sup.title": "Написать в поддержку",
    "sup.sub": "Выберите отдел — тикет попадёт нужному сотруднику. Ответ придёт в Telegram.",
    "sup.dVerif": "Верификация (голубая галочка)",
    "sup.dSales": "Продажи и сделки",
    "sup.dBan": "Блокировки",
    "sup.dOther": "Прочее",
    "sup.subjPh": "Тема обращения",
    "sup.textPh": "Опишите вопрос подробно",
    "sup.send": "Отправить тикет",
    "sup.done": "Тикет отправлен — поддержка ответит в ближайшее время.",

    "nick.title": "Придумайте ник",
    "nick.lead": "Ник виден всем в чатах и объявлениях вместо вашего логина Telegram. От 3 до 20 символов: латинские буквы, цифры, подчёркивание.",
    "nick.nickPh": "Например, dragon_slayer",
    "nick.save": "Сохранить",
    "nick.errInvalid": "Ник должен содержать 3–20 символов: латиница, цифры, подчёркивание",
    "nick.errTaken": "Этот ник уже занят — выберите другой",

    "profile.created": "Дата создания аккаунта",
    "profile.tgid": "Telegram ID",
    "profile.tgidHint": "Виден только вам",
    "profile.hideListings": "Скрыть мои объявления в публичном профиле",
    "profile.myLots": "Мои объявления",
    "profile.addLot": "Добавить объявление",
    "profile.gamePh": "Игра",
    "profile.titlePh": "Название",
    "profile.pricePh": "Цена, ₸",
    "profile.descPh": "Описание (необязательно)",
    "profile.addLotBtn": "Добавить",
    "profile.active": "Активно",
    "profile.inactive": "Неактивно",
    "profile.deactivate": "Сделать неактивным",
    "profile.activate": "Сделать активным",
    "profile.noLots": "У вас пока нет объявлений",
    "profile.hiddenNote": "Пользователь скрыл свои объявления",
    "profile.publicNoLots": "У пользователя нет активных объявлений",
    "profile.logout": "Выйти из аккаунта",
    "profile.errEmpty": "Заполните игру, название и цену",
    "profile.notFound": "Профиль не найден",
    "profile.edit": "Редактировать",
    "profile.delete": "Удалить",
    "profile.confirmDelete": "Удалить это объявление?",
    "profile.editTitle": "Редактировать объявление",

    "deal.errOwnLot": "Нельзя купить собственный лот",
    "deal.errSellerBanned": "Продавец заблокирован — сделка недоступна",
    "deal.errLotInactive": "Этот лот сейчас неактивен",
    "deal.errNotFound": "Лот не найден — возможно, его уже удалили",

    "bl.notFound": "Ничего не найдено — этот контрагент не числится в чёрном списке",
    "bl.scammer": "Мошенник",
  },
  kz: {
    "nav.home": "Басты бет",
    "nav.catalog": "Каталог",
    "nav.chats": "Чаттар",
    "nav.blacklist": "Қара тізім",
    "nav.faq": "FAQ",
    "nav.login": "Telegram арқылы кіру",
    "footer.copy": "© 2026 Myavka.safe — барлық құқықтар қорғалған",
    "footer.tagline": "Қауіпсіз онлайн-мәмілелердің кепілгер-сервисі. Қазақстан, ТМД.",
    "footer.service": "Сервис",
    "footer.help": "Көмек",
    "footer.rules": "Сервис ережелері",
    "footer.offer": "Оферта",
    "footer.contacts": "Байланыс",
    "footer.bot": "Telegram-бот",
    "footer.news": "Жаңалықтар арнасы",

    "hero.badge": "Эскроу-сервис · Қазақстан және ТМД",
    "hero.title": "Тәуекелсіз мәмілелер —<br />ақша <span class=\"safe\">Myavka.safe</span> қорғауында",
    "hero.lead": "Сатушы міндеттемелерін орындағанша сатып алушының төлемін ұстап тұрамыз. Telegram арқылы кіру, Kaspi арқылы төлем, әкімшілер тәулік бойы байланыста.",
    "hero.openCatalog": "Каталогты ашу",
    "hero.howDeal": "Мәміле қалай өтеді",
    "hero.stat1": "сәтті мәміле",
    "hero.stat2": "даусыз мәмілелер",
    "hero.stat3": "әкімшілер онлайн",
    "hero.stat4n": "5 минутқа дейін",
    "hero.stat4": "әкімші жауабы",

    "how.title": "Бұл қалай жұмыс істейді",
    "how.sub": "Төрт қадам — мәміле эскроу қорғауында",
    "how.s1t": "Келісіңіз",
    "how.s1": "Каталогтан лот табыңыз немесе контрагентпен тікелей мәміле жасаңыз.",
    "how.s2t": "Эскроуға төлем",
    "how.s2": "Сатып алушы Kaspi арқылы төлейді — ақша кепілгер шотында мұздатылады.",
    "how.s3t": "Тауарды беру",
    "how.s3": "Сатушы тауарды береді немесе қызметті мәміле чатында орындайды.",
    "how.s4t": "Ақша сатушыға",
    "how.s4": "Сатып алушы алғанын растайды — кепілгер ақшаны сатушыға аударады.",

    "why.title": "Бізге неге сенеді",
    "why.sub": "Мәміленің әр тарапын барынша қорғау",
    "why.c1t": "Тек Telegram арқылы кіру",
    "why.c1": "Құпиясөздер жоқ. Контрагенттің телефон нөмірі көрінеді — кіммен жұмыс істеп жатқаныңызды білесіз.",
    "why.c2t": "Kaspi арқылы төлем",
    "why.c2": "Қазақстан үшін үйреншікті төлем тәсілі. Мәміле аяқталғанша ақша мұздатылған.",
    "why.c3t": "Чаттағы әкімші",
    "why.c3": "Кез келген сәтте мәмілені бақылау немесе дауды шешу үшін әкімшіні шақырыңыз.",
    "why.c4t": "IP-қауіпсіздік",
    "why.c4": "Қатысушының IP-мекенжайы күдікті өзгерсе, мәміле автоматты түрде тоқтатылады.",
    "why.c5t": "Қара тізім",
    "why.c5": "Алаяқтардың ашық базасы — контрагентті Telegram, телефон немесе Kaspi арқылы тексеріңіз.",
    "why.c6t": "Сатушыларды верификациялау",
    "why.c6": "Аккаунт сату — тек жеке басын құжатпен растаған сатушылар үшін.",

    "plat.title": "Платформалар каталогы",
    "plat.sub": "Ойынды → қызмет санатын → сатушы лотын таңдаңыз",
    "plat.all": "Бүкіл каталог",
    "plat.allDesc": "Барлық ойындар мен платформалар. Өзіңіздікін таппадыңыз ба? Ұсыныңыз — қосамыз",
    "plat.go": "Каталогқа өту →",

    "price.title": "Тарифтер",
    "price.sub": "Ашық комиссия — тек сәтті мәмілелер үшін төлейсіз",
    "price.std": "Стандарт",
    "price.stdMin": "кемінде 500 ₸",
    "price.f1": "Қаражатты эскроу-қорғау",
    "price.f2": "Мәміле чаты",
    "price.f3": "Дау ашу",
    "price.f4": "Telegram хабарламалары",
    "price.create": "Мәміле жасау",
    "price.admin": "Әкімшімен",
    "price.adminFee": "+ әкімші кіруі үшін 500 ₸",
    "price.a1": "«Стандарт» тарифінің бәрі",
    "price.a2": "Чаттағы әкімші",
    "price.a3": "Әр қадамды бақылау",
    "price.a4": "Мәміле деректерін өзгерту",
    "price.vip": "VIP-сатушы",
    "price.vipFee": "5 000 ₸/айдан",
    "price.v1": "Төмендетілген комиссия",
    "price.v2": "Каталогта ерекшелену",
    "price.v3": "Айына 3 жылжыту",
    "price.v4": "Жеке менеджер",
    "price.connect": "Қосылу",

    "cta.title": "Қауіпсіз мәмілеге дайынсыз ба?",
    "cta.sub": "Telegram арқылы кіріп, алғашқы мәмілені бір минутта жасаңыз",

    "cat.title": "Каталог",
    "cat.sub": "Сервисті немесе бірден қажетті қызметті таңдаңыз",
    "cat.searchPh": "Бүкіл каталог бойынша іздеу — мысалы, «Mobile Legends алмаздары»",
    "cat.createLot": "+ Лот жасау",

    "lots.searchPh": "Осы санатта іздеу",
    "lots.sortPop": "Сұрыптау: танымал",
    "lots.sortAsc": "Бағасы: өсу бойынша",
    "lots.sortDesc": "Бағасы: кему бойынша",
    "lots.sortRate": "Сатушы рейтингі",
    "lots.priceFrom": "Бағасы бастап, ₸",
    "lots.priceTo": "Бағасы дейін, ₸",
    "lots.online": "Онлайн",
    "lots.verified": "Верификацияланған",
    "lots.escrow": "Әр сатып алу эскроумен қорғалған.",
    "lots.empty": "Бұл санатта әзірге лоттар жоқ — алғашқы сатушы болыңыз!",
    "lots.userLots": "Пайдаланушылар хабарландырулары",

    "bl.title": "Қара тізім",
    "bl.sub": "Мәміле алдында контрагентті тексеріңіз — Telegram, телефон нөмірі немесе Kaspi арқылы",
    "bl.searchPh": "@username, Telegram ID, +7 700 …, немесе Kaspi нөмірі",
    "bl.check": "Тексеру",
    "bl.recent": "Соңғы жазбалар",
    "bl.date": "Күні",
    "bl.id": "Идентификатор",
    "bl.reason": "Себебі",
    "bl.status": "Мәртебесі",

    "faq.title": "Жиі қойылатын сұрақтар",
    "faq.sub": "Myavka.safe кепілгерінің жұмысы туралы бәрі",

    "chats.title": "Чаттар",
    "chats.sub": "Сатып алушылармен және сатушылармен хат алмасу",
    "chats.inputPh": "Хабарлама жазу…",
    "chats.send": "Жіберу",
    "chats.online": "онлайн",
    "chats.offline": "желіде емес",
    "chats.paidBanner": "Клиент тапсырысты төледі",
    "chats.inEscrow": "эскроуда",
    "chats.notifTitle": "Клиент тапсырысты төледі",
    "chats.goChat": "Чатқа өту",
    "chats.you": "Сіз",
    "chats.noMsgs": "Хабарлама жоқ",
    "chats.empty": "Әзірге хабарлама жоқ — бірінші болып жазыңыз!",
    "chats.tooLarge": "Файл тым үлкен — ең көбі 5 МБ",
    "chats.banned": "Аккаунтыңыз әкімші шешіміне дейін бұғатталды. Әкімші сізбен байланысқанша күтіңіз.",
    "chats.finishDeal": "Мәмілені аяқтау",
    "chats.accIdPrompt": "Бан-база бойынша тексеру үшін сатылған аккаунт ID-ін енгізіңіз:",
    "chats.dealDone": "Мәміле аяқталды. Аккаунт таза — бан-базада жоқ.",
    "chats.dealFlagged": "⚠️ Аккаунт бан-базада бар (ұрланған/қайтарылған)! Әкімшіге хабар жіберілді, ол жағдайды қарастырады.",

    "auth.title": "Telegram арқылы кіру",
    "auth.lead": "Чаттар мен лот жасау тек тіркелгендерге қолжетімді. @myavka_safe_bot ботын ашып, Start басыңыз — ол «Сайтқа кіру» батырмасын жібереді, ол арқылы өз профиліңізбен кіресіз.",
    "auth.tgBtn": "Telegram-да ботты ашу",
    "auth.expired": "Кіру сілтемесі ескірді — ботта /login командасымен жаңасын алыңыз",
    "auth.cancel": "Бас тарту",
    "auth.logout": "Аккаунттан шығу керек пе?",
    "auth.errNet": "Желі қатесі, қайталап көріңіз",

    "promo.s1t": "Алмаз донаты<br />30 минутта",
    "promo.s1": "Сіздің ID-ге ресми донат — эскроу қорғауында",
    "promo.s2t": "Premium және Stars<br />артық төлемсіз",
    "promo.s2": "Fragment арқылы сыйлық — 10 минутта белсендіру",
    "promo.s3t": "UC ең тиімді<br />бағамен",
    "promo.s3": "ID арқылы 15 минутта есепке алынады, сервис кепілдігі",
    "home.stats": "Сервис статистикасы",
    "footer.support": "Қолдау",
    "chats.verified": "Пайдаланушы верификациядан өткен",
    "sup.title": "Қолдауға жазу",
    "sup.sub": "Бөлімді таңдаңыз — тикет тиісті қызметкерге түседі. Жауап Telegram-ге келеді.",
    "sup.dVerif": "Верификация (көк белгі)",
    "sup.dSales": "Сату және мәмілелер",
    "sup.dBan": "Бұғаттаулар",
    "sup.dOther": "Басқа",
    "sup.subjPh": "Өтініш тақырыбы",
    "sup.textPh": "Сұрағыңызды толық сипаттаңыз",
    "sup.send": "Тикет жіберу",
    "sup.done": "Тикет жіберілді — қолдау жақын арада жауап береді.",

    "nick.title": "Никнейм ойлап табыңыз",
    "nick.lead": "Никнейм чаттар мен хабарландыруларда Telegram логиныңыздың орнына барлығына көрінеді. 3–20 таңба: латын әріптері, сандар, астыңғы сызық.",
    "nick.nickPh": "Мысалы, dragon_slayer",
    "nick.save": "Сақтау",
    "nick.errInvalid": "Никнейм 3–20 таңбадан тұруы керек: латын әріптері, сандар, астыңғы сызық",
    "nick.errTaken": "Бұл никнейм бос емес — басқасын таңдаңыз",

    "profile.created": "Аккаунт құрылған күні",
    "profile.tgid": "Telegram ID",
    "profile.tgidHint": "Тек өзіңізге көрінеді",
    "profile.hideListings": "Хабарландыруларымды жария профильде жасыру",
    "profile.myLots": "Менің хабарландыруларым",
    "profile.addLot": "Хабарландыру қосу",
    "profile.gamePh": "Ойын",
    "profile.titlePh": "Атауы",
    "profile.pricePh": "Бағасы, ₸",
    "profile.descPh": "Сипаттама (міндетті емес)",
    "profile.addLotBtn": "Қосу",
    "profile.active": "Белсенді",
    "profile.inactive": "Белсенді емес",
    "profile.deactivate": "Белсенді емес ету",
    "profile.activate": "Белсенді ету",
    "profile.noLots": "Сізде әзірге хабарландыру жоқ",
    "profile.hiddenNote": "Пайдаланушы хабарландыруларын жасырды",
    "profile.publicNoLots": "Пайдаланушыда белсенді хабарландырулар жоқ",
    "profile.logout": "Аккаунттан шығу",
    "profile.errEmpty": "Ойын, атауы және бағасын толтырыңыз",
    "profile.notFound": "Профиль табылмады",
    "profile.edit": "Өзгерту",
    "profile.delete": "Жою",
    "profile.confirmDelete": "Бұл хабарландыруды жою керек пе?",
    "profile.editTitle": "Хабарландыруды өзгерту",

    "deal.errOwnLot": "Өз лотыңызды сатып ала алмайсыз",
    "deal.errSellerBanned": "Сатушы бұғатталған — мәміле қолжетімсіз",
    "deal.errLotInactive": "Бұл лот қазір белсенді емес",
    "deal.errNotFound": "Лот табылмады — ол жойылған болуы мүмкін",

    "bl.notFound": "Ештеңе табылмады — бұл контрагент қара тізімде жоқ",
    "bl.scammer": "Алаяқ",
  },
  en: {
    "nav.home": "Home",
    "nav.catalog": "Catalog",
    "nav.chats": "Chats",
    "nav.blacklist": "Blacklist",
    "nav.faq": "FAQ",
    "nav.login": "Sign in with Telegram",
    "footer.copy": "© 2026 Myavka.safe — all rights reserved",
    "footer.tagline": "Escrow service for safe online deals. Kazakhstan, CIS.",
    "footer.service": "Service",
    "footer.help": "Help",
    "footer.rules": "Service rules",
    "footer.offer": "Terms",
    "footer.contacts": "Contacts",
    "footer.bot": "Telegram bot",
    "footer.news": "News channel",

    "hero.badge": "Escrow service · Kazakhstan & CIS",
    "hero.title": "Risk-free deals —<br />money protected by <span class=\"safe\">Myavka.safe</span>",
    "hero.lead": "We hold the buyer's payment until the seller fulfills their obligations. Telegram login, Kaspi payments, admins available around the clock.",
    "hero.openCatalog": "Open catalog",
    "hero.howDeal": "How a deal works",
    "hero.stat1": "successful deals",
    "hero.stat2": "deals without disputes",
    "hero.stat3": "admins online",
    "hero.stat4n": "under 5 min",
    "hero.stat4": "admin response",

    "how.title": "How it works",
    "how.sub": "Four steps — and your deal is protected by escrow",
    "how.s1t": "Agree on terms",
    "how.s1": "Find a listing in the catalog or create a deal directly with your counterparty.",
    "how.s2t": "Pay into escrow",
    "how.s2": "The buyer pays via Kaspi — the money is frozen in the escrow account.",
    "how.s3t": "Deliver the goods",
    "how.s3": "The seller delivers the goods or performs the service right in the deal chat.",
    "how.s4t": "Seller gets paid",
    "how.s4": "The buyer confirms receipt — the escrow releases the money to the seller.",

    "why.title": "Why people trust us",
    "why.sub": "Maximum protection for every side of the deal",
    "why.c1t": "Telegram-only login",
    "why.c1": "No passwords. Your counterparty's phone number is visible — you know who you're dealing with.",
    "why.c2t": "Kaspi payments",
    "why.c2": "The familiar payment method for Kazakhstan. Money stays frozen until the deal completes.",
    "why.c3t": "Admin in the chat",
    "why.c3": "Call an admin at any moment to supervise the deal or resolve a dispute.",
    "why.c4t": "IP security",
    "why.c4": "The deal is automatically paused if a participant's IP address changes suspiciously.",
    "why.c5t": "Blacklist",
    "why.c5": "An open scammer database — check your counterparty by Telegram, phone, or Kaspi.",
    "why.c6t": "Seller verification",
    "why.c6": "Account sales are allowed only for sellers who verified their identity with documents.",

    "plat.title": "Platform catalog",
    "plat.sub": "Pick a game → service category → seller's listing",
    "plat.all": "Full catalog",
    "plat.allDesc": "All games and platforms. Can't find yours? Suggest it — we'll add it",
    "plat.go": "Go to catalog →",

    "price.title": "Pricing",
    "price.sub": "Transparent commission — pay only for successful deals",
    "price.std": "Standard",
    "price.stdMin": "minimum 500 ₸",
    "price.f1": "Escrow protection",
    "price.f2": "Deal chat",
    "price.f3": "Dispute opening",
    "price.f4": "Telegram notifications",
    "price.create": "Create a deal",
    "price.admin": "With admin",
    "price.adminFee": "+ 500 ₸ for admin entry",
    "price.a1": "Everything in Standard",
    "price.a2": "Admin in the chat",
    "price.a3": "Every step supervised",
    "price.a4": "Deal data changes",
    "price.vip": "VIP seller",
    "price.vipFee": "from 5,000 ₸/mo",
    "price.v1": "Reduced commission",
    "price.v2": "Highlighted in catalog",
    "price.v3": "3 promotions per month",
    "price.v4": "Personal manager",
    "price.connect": "Subscribe",

    "cta.title": "Ready for a safe deal?",
    "cta.sub": "Sign in with Telegram and create your first deal in a minute",

    "cat.title": "Catalog",
    "cat.sub": "Pick a service or jump straight to what you need",
    "cat.searchPh": "Search the whole catalog — e.g. \"Mobile Legends diamonds\"",
    "cat.createLot": "+ Create listing",

    "lots.searchPh": "Search in this category",
    "lots.sortPop": "Sort: popular",
    "lots.sortAsc": "Price: low to high",
    "lots.sortDesc": "Price: high to low",
    "lots.sortRate": "Seller rating",
    "lots.priceFrom": "Price from, ₸",
    "lots.priceTo": "Price to, ₸",
    "lots.online": "Online",
    "lots.verified": "Verified",
    "lots.escrow": "Every purchase is protected by escrow.",
    "lots.empty": "No listings in this category yet — be the first seller!",
    "lots.userLots": "User listings",

    "bl.title": "Blacklist",
    "bl.sub": "Check your counterparty before the deal — by Telegram, phone number, or Kaspi",
    "bl.searchPh": "@username, Telegram ID, +7 700 …, or Kaspi number",
    "bl.check": "Check",
    "bl.recent": "Recent entries",
    "bl.date": "Date",
    "bl.id": "Identifier",
    "bl.reason": "Reason",
    "bl.status": "Status",

    "faq.title": "FAQ",
    "faq.sub": "Everything about how the Myavka.safe escrow works",

    "chats.title": "Chats",
    "chats.sub": "Messages with buyers and sellers",
    "chats.inputPh": "Write a message…",
    "chats.send": "Send",
    "chats.online": "online",
    "chats.offline": "offline",
    "chats.paidBanner": "Client paid the order",
    "chats.inEscrow": "in escrow",
    "chats.notifTitle": "Client paid an order",
    "chats.goChat": "Open chat",
    "chats.you": "You",
    "chats.noMsgs": "No messages",
    "chats.empty": "No messages yet — be the first to write!",
    "chats.tooLarge": "File is too large — 5 MB max",
    "chats.banned": "Your account is blocked until the administrator resolves the case. Please wait for the administrator to contact you.",
    "chats.finishDeal": "Complete deal",
    "chats.accIdPrompt": "Enter the sold account ID to check against the ban database:",
    "chats.dealDone": "Deal completed. The account is clean — not in the ban database.",
    "chats.dealFlagged": "⚠️ This account is in the ban database (stolen/returned)! The administrator has been notified and will look into it.",

    "auth.title": "Sign in with Telegram",
    "auth.lead": "Chats and lot creation are for registered users only. Open the @myavka_safe_bot bot, press Start — it sends a «Sign in» button that brings you back here already signed in.",
    "auth.tgBtn": "Open the bot in Telegram",
    "auth.expired": "The sign-in link expired — request a new one in the bot with /login",
    "auth.cancel": "Cancel",
    "auth.logout": "Log out of the account?",
    "auth.errNet": "Network error, please try again",

    "promo.s1t": "Diamond top up<br />in 30 minutes",
    "promo.s1": "Official top up to your ID, protected by escrow",
    "promo.s2t": "Premium & Stars<br />at fair prices",
    "promo.s2": "Gifted via Fragment — activated in 10 minutes",
    "promo.s3t": "UC at the best<br />rate",
    "promo.s3": "Credited via ID in 15 minutes, service guarantee",
    "home.stats": "Service statistics",
    "footer.support": "Support",
    "chats.verified": "Verified user",
    "sup.title": "Contact support",
    "sup.sub": "Pick a department — the ticket goes to the right team. The reply arrives in Telegram.",
    "sup.dVerif": "Verification (blue badge)",
    "sup.dSales": "Sales & deals",
    "sup.dBan": "Bans",
    "sup.dOther": "Other",
    "sup.subjPh": "Subject",
    "sup.textPh": "Describe your issue in detail",
    "sup.send": "Submit ticket",
    "sup.done": "Ticket sent — support will reply shortly.",

    "nick.title": "Choose a nickname",
    "nick.lead": "Your nickname is shown to everyone in chats and listings instead of your Telegram login. 3–20 characters: Latin letters, digits, underscore.",
    "nick.nickPh": "e.g. dragon_slayer",
    "nick.save": "Save",
    "nick.errInvalid": "Nickname must be 3–20 characters: Latin letters, digits, underscore",
    "nick.errTaken": "This nickname is already taken — choose another one",

    "profile.created": "Account created",
    "profile.tgid": "Telegram ID",
    "profile.tgidHint": "Visible only to you",
    "profile.hideListings": "Hide my listings from my public profile",
    "profile.myLots": "My listings",
    "profile.addLot": "Add a listing",
    "profile.gamePh": "Game",
    "profile.titlePh": "Title",
    "profile.pricePh": "Price, ₸",
    "profile.descPh": "Description (optional)",
    "profile.addLotBtn": "Add",
    "profile.active": "Active",
    "profile.inactive": "Inactive",
    "profile.deactivate": "Deactivate",
    "profile.activate": "Activate",
    "profile.noLots": "You don't have any listings yet",
    "profile.hiddenNote": "This user has hidden their listings",
    "profile.publicNoLots": "This user has no active listings",
    "profile.logout": "Log out",
    "profile.errEmpty": "Fill in game, title, and price",
    "profile.notFound": "Profile not found",
    "profile.edit": "Edit",
    "profile.delete": "Delete",
    "profile.confirmDelete": "Delete this listing?",
    "profile.editTitle": "Edit listing",

    "deal.errOwnLot": "You can't buy your own listing",
    "deal.errSellerBanned": "Seller is banned — deal unavailable",
    "deal.errLotInactive": "This listing is no longer active",
    "deal.errNotFound": "Listing not found — it may have already been removed",

    "bl.notFound": "Nothing found — this contact isn't on the blacklist",
    "bl.scammer": "Scammer",
  },
};

// Экранирование пользовательского текста перед вставкой в DOM (единая версия для всех страниц)
const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function getLang() {
  const l = localStorage.getItem("lang");
  return I18N[l] ? l : "ru";
}

function t(key) {
  return I18N[getLang()][key] ?? I18N.ru[key] ?? key;
}

function applyLang() {
  const lang = getLang();
  document.documentElement.lang = lang === "kz" ? "kk" : lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  const sel = document.getElementById("lang-select");
  if (sel) sel.value = lang;
}

function applyTheme() {
  const theme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = theme === "light" ? "☾" : "☀";
}

document.getElementById("theme-toggle")?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  localStorage.setItem("theme", next);
  applyTheme();
});

document.getElementById("lang-select")?.addEventListener("change", (e) => {
  localStorage.setItem("lang", e.target.value);
  applyLang();
  document.dispatchEvent(new Event("langchange"));
});

applyTheme();
applyLang();

// ---------- Авторизация (мини-окно) ----------
function getUser() {
  try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
}

function showAuthModal(onSuccess, onCancel) {
  document.getElementById("auth-modal")?.remove();
  const wrap = document.createElement("div");
  wrap.id = "auth-modal";
  wrap.className = "modal-overlay";
  wrap.innerHTML = `
    <div class="modal">
      <h3>${t("auth.title")}</h3>
      <p>${t("auth.lead")}</p>
      <div class="modal-error" id="auth-error" hidden></div>
      <button class="btn btn-tg" id="auth-tg">${t("auth.tgBtn")}</button>
      <button class="btn btn-outline" id="auth-cancel">${t("auth.cancel")}</button>
    </div>`;
  document.body.appendChild(wrap);
  const close = () => wrap.remove();

  wrap.querySelector("#auth-tg").addEventListener("click", () => {
    window.open("https://t.me/myavka_safe_bot", "_blank");
  });

  wrap.querySelector("#auth-cancel").addEventListener("click", () => { close(); onCancel?.(); });
  wrap.addEventListener("click", (e) => { if (e.target === wrap) { close(); onCancel?.(); } });
}

// Модалка «придумайте ник» — показывается, когда tg-login вернул needsNick:true
// (аккаунта в Telegram ещё нет никнейма). Пока ник не задан, сессии/токена тоже нет.
function showNickModal(regToken) {
  document.getElementById("nick-modal")?.remove();
  const wrap = document.createElement("div");
  wrap.id = "nick-modal";
  wrap.className = "modal-overlay";
  wrap.innerHTML = `
    <div class="modal">
      <h3>${t("nick.title")}</h3>
      <p>${t("nick.lead")}</p>
      <input type="text" id="nick-input" maxlength="20" autocomplete="off" placeholder="${t("nick.nickPh")}" />
      <div class="modal-error" id="nick-error" hidden></div>
      <button class="btn btn-primary" id="nick-save">${t("nick.save")}</button>
    </div>`;
  document.body.appendChild(wrap);

  const errEl = wrap.querySelector("#nick-error");
  const showErr = (msg) => { errEl.textContent = msg; errEl.hidden = false; };
  const input = wrap.querySelector("#nick-input");

  const submit = async () => {
    const nick = input.value.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(nick)) { showErr(t("nick.errInvalid")); return; }
    errEl.hidden = true;
    try {
      const res = await fetch("/api/auth/set-nick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regToken, nick }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        localStorage.setItem("user", JSON.stringify({ name: data.nick, token: data.token, balance: data.balance || 0 }));
        localStorage.setItem("chat_name", data.nick);
        wrap.remove();
        updateLoginButtons();
      } else if (data.error === "taken") {
        showErr(t("nick.errTaken"));
      } else if (data.error === "invalid") {
        showErr(t("nick.errInvalid"));
      } else if (data.error === "expired") {
        showErr(t("auth.expired"));
      } else {
        showErr(t("auth.errNet"));
      }
    } catch {
      showErr(t("auth.errNet"));
    }
  };

  wrap.querySelector("#nick-save").addEventListener("click", submit);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
}

// ---------- Общие модалки (замена alert()/prompt() браузера — совместимость с CSP) ----------

// Модалка с текстовым полем ввода и кнопками «подтвердить»/«отмена».
// onSubmit(value) вызывается со строкой (уже .trim()); onCancel() — при закрытии без ввода.
function showPromptModal(message, submitLabel, onSubmit, onCancel) {
  document.getElementById("prompt-modal")?.remove();
  const wrap = document.createElement("div");
  wrap.id = "prompt-modal";
  wrap.className = "modal-overlay";
  wrap.innerHTML = `
    <div class="modal">
      <p>${escHtml(message)}</p>
      <input type="text" id="prompt-input" autocomplete="off" />
      <div class="modal-error" id="prompt-error" hidden></div>
      <button class="btn btn-primary" id="prompt-submit">${escHtml(submitLabel)}</button>
      <button class="btn btn-outline" id="prompt-cancel">${t("auth.cancel")}</button>
    </div>`;
  document.body.appendChild(wrap);
  const input = wrap.querySelector("#prompt-input");
  const close = () => wrap.remove();

  const submit = () => {
    const value = input.value.trim();
    if (!value) return;
    close();
    onSubmit(value);
  };

  wrap.querySelector("#prompt-submit").addEventListener("click", submit);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
  wrap.querySelector("#prompt-cancel").addEventListener("click", () => { close(); onCancel?.(); });
  wrap.addEventListener("click", (e) => { if (e.target === wrap) { close(); onCancel?.(); } });
  input.focus();
}

// Информационная модалка — замена alert(). onClose вызывается при закрытии (кнопкой или оверлеем).
function showInfoModal(message, onClose) {
  document.getElementById("info-modal")?.remove();
  const wrap = document.createElement("div");
  wrap.id = "info-modal";
  wrap.className = "modal-overlay";
  wrap.innerHTML = `
    <div class="modal">
      <p>${escHtml(message)}</p>
      <button class="btn btn-primary" id="info-ok">OK</button>
    </div>`;
  document.body.appendChild(wrap);
  const close = () => { wrap.remove(); onClose?.(); };
  wrap.querySelector("#info-ok").addEventListener("click", close);
  wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });
}

// Вход по одноразовой ссылке из бота (?login=код)
async function tryLinkLogin() {
  const params = new URLSearchParams(location.search);
  const code = params.get("login");
  if (!code || !/^[0-9a-f]{32}$/.test(code)) return;
  params.delete("login");
  const clean = location.pathname + (params.toString() ? "?" + params.toString() : "");
  history.replaceState(null, "", clean);
  try {
    const res = await fetch("/api/auth/tg-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (res.ok && data.ok && data.needsNick) {
      showNickModal(data.regToken);
    } else if (res.ok && data.ok) {
      localStorage.setItem("user", JSON.stringify({ name: data.nick, token: data.token, balance: data.balance || 0 }));
      localStorage.setItem("chat_name", data.nick);
      updateLoginButtons();
    } else if (res.status === 410 && !getUser()) {
      alert(t("auth.expired"));
    }
  } catch { /* сеть недоступна */ }
}

async function refreshBalance() {
  const user = getUser();
  if (!user?.token) return;
  try {
    const res = await fetch("/api/auth/me", {
      method: "POST",
      headers: { Authorization: "Bearer " + user.token },
    });
    if (res.status === 401) { localStorage.removeItem("user"); updateLoginButtons(); return; }
    const data = await res.json();
    if (data.ok) {
      user.balance = data.balance;
      localStorage.setItem("user", JSON.stringify(user));
      updateLoginButtons();
    }
  } catch { /* сеть недоступна — покажем кэш */ }
}

function updateLoginButtons() {
  const user = getUser();
  document.querySelectorAll(".btn-tg[data-i18n='nav.login']").forEach((btn) => {
    if (user) {
      btn.textContent = `👤 ${user.name} · ${user.balance ?? 0} ₸`;
      btn.removeAttribute("data-i18n");
      btn.href = "profile.html";
      btn.onclick = null;
    } else {
      btn.onclick = (e) => { e.preventDefault(); showAuthModal(() => location.reload()); };
    }
  });
}

function requireAuth(onSuccess, onCancel) {
  const user = getUser();
  if (user) { onSuccess?.(user); return; }
  showAuthModal(onSuccess, onCancel);
}

// Создание лота и сделки — только для зарегистрированных
document.querySelectorAll("[data-i18n='cat.createLot'], [data-i18n='price.create']").forEach((btn) => {
  btn.addEventListener("click", (e) => { e.preventDefault(); requireAuth(); });
});

updateLoginButtons();
tryLinkLogin().then(refreshBalance);
document.addEventListener("langchange", updateLoginButtons);

// ---------- Промо-карусель на главной ----------
(function initPromoSlider() {
  const track = document.getElementById("promo-track");
  const dotsBox = document.getElementById("promo-dots");
  if (!track || !dotsBox) return;
  const count = track.children.length;
  let idx = 0;
  let timer;

  dotsBox.innerHTML = Array.from({ length: count }, (_, i) => `<button data-i="${i}" aria-label="Слайд ${i + 1}"></button>`).join("");
  const dots = [...dotsBox.children];

  function go(i) {
    idx = (i + count) % count;
    track.style.transform = `translateX(-${idx * 100}%)`;
    dots.forEach((d, n) => d.classList.toggle("active", n === idx));
  }
  function auto() { clearInterval(timer); timer = setInterval(() => go(idx + 1), 4500); }

  dots.forEach((d) => d.addEventListener("click", () => { go(Number(d.dataset.i)); auto(); }));
  go(0);
  auto();
})();
