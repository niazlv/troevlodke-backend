import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import * as argon from 'argon2';
import * as fs from 'fs';
import path from 'path/posix';

const quizze_data = [{'title': 'ИЗО', 'data': [{'answers': ['Графика', 'Акварель', 'Масло', 'Акрил'], 'question': 'Как называется техника рисования, при которой используется специальное перо и мастихин?', 'correct_answer': 'Графика'}, {'answers': ['Карандаш', 'Уголь', 'Тушь', 'Маркер'], 'question': 'Как называется техника рисования, при которой используется специальный стержень для нанесения черных линий?', 'correct_answer': 'Карандаш'}, {'answers': ['Акварель', 'Графика', 'Масло', 'Акрил'], 'question': 'Как называется техника рисования, при которой используется жидкая краска, смешанная с водой?', 'correct_answer': 'Акварель'}, {'answers': ['Масло', 'Акварель', 'Графика', 'Акрил'], 'question': 'Как называется техника рисования, при которой используется смесь масла и пигмента?', 'correct_answer': 'Масло'}, {'answers': ['А.И. Куинджи', 'И.И. Левитан', 'В.В. Кандинский', 'К.С. Малевич'], 'question': 'Кто является автором знаменитой картины "Утро в сосновом лесу"?', 'correct_answer': 'И.И. Левитан'}, {'answers': ['Красный квадрат', 'Мона Лиза', 'Тайная вечеря', 'Поле васильков'], 'question': 'Какое из произведений Казимира Малевича является символом супрематизма?', 'correct_answer': 'Красный квадрат'}]}, {'title': 'Вокал', 'data': [{'answers': ['Флайбар', 'Трапеция', 'Аэробатика', 'Аэрофон'], 'question': 'Как называется вид циркового искусства, при котором артисты играют на музыкальных инструментах, находясь в воздухе?', 'correct_answer': 'Флайбар'}, {'answers': ['Темп', 'Легато', 'Стаккато', 'Арпеджио'], 'question': 'Как называется музыкальный термин, который означает плавное переход от одной ноты к другой?', 'correct_answer': 'Легато'}, {'answers': ['Рок', 'Поп', 'Опера', 'Джаз'], 'question': 'Как называется музыкальный жанр, который исполняется с оркестром и характеризуется наличием рецитативов и арий?', 'correct_answer': 'Опера'}, {'answers': ['Рок', 'Поп', 'Джаз', 'Классическая музыка'], 'question': 'Какой из этих музыкальных жанров является наиболее технически сложным для исполнения?', 'correct_answer': 'Классическая музыка'}, {'answers': ['Вибрато', 'Тремоло', 'Арпеджио', 'Стаккато'], 'question': 'Как называется музыкальный термин, который означает быстрое повторение одной и той же ноты?', 'correct_answer': 'Тремоло'}]}, {'title': 'Театр', 'data': [{'answers': ['Жан Батист Мольер', 'Уильям Шекспир', 'Антон Чехов', 'Максим Горький'], 'question': 'Кто является автором пьесы "Гамлет"?', 'correct_answer': 'Уильям Шекспир'}, {'answers': ['Импровизация', 'Репетиция', 'Работа над ролью', 'Технические репетиции'], 'question': 'Как называется процесс создания сценического образа актером?', 'correct_answer': 'Работа над ролью'}, {'answers': ['Моноспектакль', 'Музыкальный спектакль', 'Ансамблевый спектакль', 'Варьете'], 'question': 'Как называется спектакль, который состоит из нескольких эпизодов, каждый из которых имеет свою сюжетную линию, но все они связаны общей темой?', 'correct_answer': 'Ансамблевый спектакль'}, {'answers': ['Чтецкий спектакль', 'Камерный спектакль', 'Театр одного актера', 'Моноспектакль'], 'question': 'Как называется спектакль, в котором актеры читают текст, а не играют сцены?', 'correct_answer': 'Чтецкий спектакль'}, {'answers': ['Малый театр', 'Московский художественный театр', 'Большой театр', 'Александринский театр'], 'question': 'Какой театр является старейшим в России?', 'correct_answer': 'Александринский театр'}, {'answers': ['Большой театр', 'Московский театр оперетты', 'Московский художественный театр', 'Театр им. Маяковского'], 'question': 'Какой театр является самым большим в России и одним из самых крупных в мире?', 'correct_answer': 'Большой театр'}]}, {'title': 'Гитара', 'data': [{'answers': ['1, 2, 3', '2, 3, 4', '3, 4, 5', '4, 5, 6'], 'question': 'Какие струны на гитаре являются самыми тонкими?', 'correct_answer': '1, 2, 3'}, {'answers': ['Арпеджио', 'Хаммер-он', 'Пулл-офф', 'Баррэ'], 'question': 'Как называется прием игры на гитаре, при котором струны зажимаются пальцами левой руки?', 'correct_answer': 'Баррэ'}, {'answers': ['Метроном', 'Тюнер', 'Медиатор', 'Кейпод'], 'question': 'Как называется музыкальный инструмент, который используется для настройки гитары?', 'correct_answer': 'Тюнер'}, {'answers': ['Александр Иванов', 'Олег Митяев', 'Владимир Миколаенко', 'Эдуард Артемьев'], 'question': 'Какой русский гитарист является лауреатом Государственной премии России в области культуры и искусства?', 'correct_answer': 'Владимир Миколаенко'}, {'answers': ['Арпеджио', 'Соло', 'Аккорд', 'Бенд'], 'question': 'Как называется способ игры на гитаре, при котором струны звучат одновременно?', 'correct_answer': 'Аккорд'}, {'answers': ['Владимир Высоцкий', 'Виктор Зинчук', 'Александр Розенбаум', 'Леонид Федоров'], 'question': 'Какой русский музыкант стал известен благодаря своей уникальной технике игры на гитаре, которую он назвал "виртуозное пение"?', 'correct_answer': 'Виктор Зинчук'}]}, {'title': 'Дизайн', 'data': [{'answers': ['Зеленый', 'Красный', 'Фиолетовый', 'Коричневый'], 'question': 'Какой из этих цветов не является основным цветом?', 'correct_answer': 'Коричневый'}, {'answers': ['Дизайн', 'Скетчинг', 'Лейаут', 'Прототипирование'], 'question': 'Как называется процесс создания макета будущего изделия?', 'correct_answer': 'Прототипирование'}, {'answers': ['Квадрат', 'Круг', 'Куб', 'Треугольник'], 'question': 'Как называется многогранник, который используется в 3D-моделировании?', 'correct_answer': 'Куб'}, {'answers': ['Adobe Photoshop', 'Adobe Illustrator', 'CorelDRAW', 'Paint'], 'question': 'Какая из этих программ является векторным графическим редактором?', 'correct_answer': 'Adobe Illustrator'}, {'answers': ['Арт-деко', 'Модерн', 'Эко', 'Классика'], 'question': 'Как называется стиль дизайна, который использует элементы природы в своих работах?', 'correct_answer': 'Эко'}, {'answers': ['Монохромная', 'Контрастная', 'Натуральная', 'Пастельная'], 'question': 'Как называется цветовая гамма, которая используется в дизайне интерьера и создает ощущение уюта и тепла?', 'correct_answer': 'Натуральная'}]}, {'title': 'Скрипка', 'data': [{'answers': ['1/2', '1/4', '3/4', '4/4'], 'question': 'Как называется детский размер скрипки?', 'correct_answer': '1/2'}, {'answers': ['Арпеджио', 'Вибрато', 'Легато', 'Двойные стопы'], 'question': 'Как называется техника игры на скрипке, при которой музыкант играет две или более нот одновременно?', 'correct_answer': 'Двойные стопы'}, {'answers': ['Сюита для оркестра', 'Соната для скрипки', 'Концерт для скрипки и оркестра', 'Симфония для оркестра'], 'question': 'Какой из этих музыкальных произведений написан для скрипки и оркестра?', 'correct_answer': 'Концерт для скрипки и оркестра'}, {'answers': ['Исаак Штерн', 'Яша Хейфец', 'Дэвид Гарретт', 'Ванесса Мэй'], 'question': 'Какой из этих скрипачей считается одним из самых известных в мире?', 'correct_answer': 'Яша Хейфец'}, {'answers': ['Скрипач-виртуоз', 'Скрипач-экспериментатор', 'Скрипач-вокалист', 'Скрипач-импровизатор'], 'question': 'Как называется исполнитель, который играет на скрипке и одновременно поет?', 'correct_answer': 'Скрипач-вокалист'}]}, {'title': 'Живопись', 'data': [{'answers': ['Пабло Пикассо', 'Клод Моне', 'Винсент Ван Гог', 'Сальвадор Дали'], 'question': 'Какой из этих художников является представителем импрессионизма?', 'correct_answer': 'Клод Моне'}, {'answers': ['Акварель', 'Масло', 'Гравюра', 'Гуашь'], 'question': 'Как называется техника живописи, при которой краски наносятся на мокрую поверхность?', 'correct_answer': 'Акварель'}, {'answers': ['Леонардо да Винчи', 'Рафаэль', 'Микеланджело', 'Пьетро Перуджино'], 'question': 'Какой из этих художников является автором картины "Тайная вечеря"?', 'correct_answer': 'Леонардо да Винчи'}, {'answers': ['Гуашь', 'Масло', 'Акварель', 'Гравюра'], 'question': 'Как называется техника живописи, при которой краски наносятся на сухую поверхность?', 'correct_answer': 'Масло'}, {'answers': ['Илья Репин', 'Василий Кандинский', 'Иван Шишкин', 'Николай Рерих'], 'question': 'Какой из этих художников является представителем авангарда?', 'correct_answer': 'Василий Кандинский'}, {'answers': ['Реализм', 'Импрессионизм', 'Супрематизм', 'Передвижники'], 'question': 'Как называется течение в русской живописи, которое отражает быт и повседневную жизнь крестьян?', 'correct_answer': 'Передвижники'}]}, {'title': 'Фортепиано', 'data': [{'answers': ['До, ре, ми, фа, соль, ля, си', 'До#, ре#, фа#, соль#, ля#', 'До, ре, ми, фа, соль', 'До#, ре#, соль#, ля#'], 'question': 'Какие клавиши на фортепиано являются "черными"?', 'correct_answer': 'До#, ре#, фа#, соль#, ля#'}, {'answers': ['Сергей Рахманинов', 'Петр Чайковский', 'Федор Шаляпин', 'Антон Рубинштейн'], 'question': 'Кто является первым русским пианистом, ставшим всемирно известным?', 'correct_answer': 'Антон Рубинштейн'}, {'answers': ['Людвиг ван Бетховен', 'Кристофори', 'Йозеф Гайдн', 'Вольфганг Амадей Моцарт'], 'question': 'Кто является изобретателем фортепиано?', 'correct_answer': 'Кристофори'}, {'answers': ['Стаккато', 'Легато', 'Арпеджио', 'Виртуозный стиль'], 'question': 'Как называется стиль игры на фортепиано, когда ноты играются быстро и легко?', 'correct_answer': 'Виртуозный стиль'}, {'answers': ['Вибрато', 'Терцет', 'Метроном', 'Тембр'], 'question': 'Как называется музыкальный инструмент, который используется для настройки фортепиано?', 'correct_answer': 'Метроном'}, {'answers': ['Петр Чайковский', 'Сергей Рахманинов', 'Дмитрий Шостакович', 'Сергей Прокофьев'], 'question': 'Какой русский композитор написал знаменитый концерт для фортепиано с оркестром?', 'correct_answer': 'Сергей Рахманинов'}]}, {'title': 'Хореография', 'data': [{'answers': ['Вальс', 'Фокстрот', 'Ча-ча-ча', 'Румба'], 'question': 'Как называется танец, который популярен в странах Латинской Америки и исполняется в паре?', 'correct_answer': 'Румба'}, {'answers': ['Вальс', 'Танго', 'Конго', 'Калинка-малинка'], 'question': 'Какой танец создан в России и является символом страны?', 'correct_answer': 'Калинка-малинка'}, {'answers': ['Классический танец', 'Хип-хоп', 'Фламенко', 'Брейк-данс'], 'question': 'Какой вид танца исполняют балерины на цыпочках?', 'correct_answer': 'Классический танец'}, {'answers': ['Самба', 'Фламенко', 'Сиртаки', 'Танго'], 'question': 'Как называется танец, который исполняют мужчины в традиционной греческой одежде?', 'correct_answer': 'Сиртаки'}, {'answers': ['Чардаш', 'Речной вальс', 'Ирландский танец', 'Скоттиш'], 'question': 'Какой из этих танцев является национальным танцем Ирландии?', 'correct_answer': 'Ирландский танец'}, {'answers': ['1708 год', '1773 год', '1811 год', '1885 год'], 'question': 'В каком году была создана первая современная балетная школа в России?', 'correct_answer': '1885 год'}]}, {'title': 'Хоровое пение', 'data': [{'answers': ['Рок', 'Классика', 'Джаз', 'Поп'], 'question': 'Какой вид музыки исполняется при хоровом пении?', 'correct_answer': 'Классика'}, {'answers': ['Дирижер', 'Композитор', 'Солист', 'Пианист'], 'question': 'Как называется руководитель хора?', 'correct_answer': 'Дирижер'}, {'answers': ['Церковный хор', 'Школьный хор', 'Ансамбль народной песни', 'Академический хор'], 'question': 'Какой из этих хоров является профессиональным?', 'correct_answer': 'Академический хор'}, {'answers': ['1895', '1925', '1955', '1995'], 'question': 'В каком году был создан Государственный академический русский хор?', 'correct_answer': '1925'}]}, {'title': 'Цирковое искусство', 'data': [{'answers': ['Трапеция', 'Акробатика', 'Эквилибристика', 'Контроль над телом'], 'question': 'Как называется упражнение, при котором артист держится на одной руке и крутит на ней кольца?', 'correct_answer': 'Эквилибристика'}, {'answers': ['Флайбар', 'Трапеция', 'Аэробатика', 'Слэклайн'], 'question': 'Как называется вид циркового искусства, при котором артисты выступают на веревках, натянутых на высоте?', 'correct_answer': 'Трапеция'}, {'answers': ['Кольца', 'Стул', 'Лента', 'Брусья'], 'question': 'Как называется атрибут, который используется при выступлениях на трапеции?', 'correct_answer': 'Лента'}, {'answers': ['Трапеция', 'Акробатика', 'Эквилибристика', 'Хук'], 'question': 'Как называется вид циркового искусства, при котором артисты летают в воздухе, поднимаясь на крюках, закрепленных за их кожей?', 'correct_answer': 'Хук'}, {'answers': ['Флайбар', 'Трапеция', 'Аэробатика', 'Аэрофон'], 'question': 'Как называется вид циркового искусства, при котором артисты играют на музыкальных инструментах, находясь в воздухе?', 'correct_answer': 'Флайбар'}]}, {'title': 'Ударные инструменты', 'data': [{'answers': ['Бас-барабан', 'Хай-хэт', 'Крэш-бек', 'Флор-том'], 'question': 'Как называется ударный инструмент, который обладает наиболее низким звуком?', 'correct_answer': 'Бас-барабан'}, {'answers': ['Крэш-бек', 'Хай-хэт', 'Малый барабан', 'Триангл'], 'question': 'Какой ударный инструмент играет роль метронома в музыке?', 'correct_answer': 'Малый барабан'}, {'answers': ['Конга', 'Бонго', 'Тимбалы', 'Бас-барабан'], 'question': 'Как называется ударный инструмент, который используется для создания ритмической структуры в музыке жанра регги?', 'correct_answer': 'Бас-барабан'}, {'answers': ['Хай-хэт', 'Крэш-бек', 'Райд', 'Тарелка-шумовка'], 'question': 'Какой ударный инструмент обладает самым высоким звуком?', 'correct_answer': 'Хай-хэт'}]}]

function getDataFromFile(filename:string) {
    var linesSplit = [];

    var f = fs.readFileSync(filename,'utf8');
    var tabs:number;
    f = f.replace(/  +/g, ' ');
    var lines = f.split("\n");
    for(var i = 1; i < lines.length; i++) {
        //if(!linesSplit[0]) linesSplit[0] = [];
        linesSplit[i-1] = lines[i].split(' ');
        linesSplit[i-1][0] = Number(linesSplit[i-1][0]);
    }
    return linesSplit;
}

async function main() {
    var count:number;


    /** Create roles */
    const roles = getDataFromFile(fs.existsSync("./role.txt")?"./role.txt":"./src/role.txt");
    count = 0;
    var data_roles = await prisma.role.findMany({});
    for(var i = 0; i < data_roles.length; i++) {
        if(data_roles[i].bit == roles[i][0] && data_roles[i].name == roles[i][1]) count++;
    }
    if(count != roles.length) {
        for(var i = 0; i < roles.length; i++) {
            var role = await prisma.role.upsert({
                create:{
                    bit: roles[i][0],
                    name: roles[i][1],
                },
                update:{/** Nothing*/},
                where: {
                    bit: roles[i][0],
                },
            });
            console.log(role);
        }
        console.debug("roles created!");
    }
    
    /** Create permissions */
    const permissions = getDataFromFile(fs.existsSync("./permissions.txt")? "./permissions.txt":"./src/permissions.txt");
    count = 0;
    var data_permissions = await prisma.permissions.findMany({});
    for(var i = 0; i < data_permissions.length; i++) {
        if(data_permissions[i].bit == permissions[i][0] && data_permissions[i].name == permissions[i][1]) count++;
    }
    if(count != permissions.length) {
        for(var i = 0; i < permissions.length; i++) {
            var permission = await prisma.permissions.upsert({
                create:{
                    bit: permissions[i][0],
                    name: permissions[i][1],
                },
                update:{/** Nothing*/},
                where: {
                    bit: permissions[i][0],
                },
            });
            console.log(permission);
        }
        console.debug("permissions created");
    }

    /** create admin */
    const hash = await argon.hash("123");
    try {
        var admin = await prisma.user.create({
            data: {
                id:1,
                login: "admin",
                hash: hash,
                permissions: BigInt(BigInt(1n<<32n)-1n),
                role: 1
            }
        });
        console.log(admin)
        console.debug("admin created");
    } catch(error) {
        if(error.code == "P2002") {
            console.warn("admin is exist");
        }
        else {
            console.warn("admin not created!");
            console.error(error);
        }
    }


    /** create basic registration quizzes */
    for(var i = 0; i < quizze_data.length;i++) {
        try {
            const quizzes = await prisma.quizzes.create({
                data: {
                    id: i+1,
                    title: quizze_data[i].title,
                    data: quizze_data[i].data
                }
            });
            console.log(quizzes)
            console.debug("quizzes "+i+" created")
        } catch(error) {
            if(error.code == "P2002") {
                console.warn("quizzes "+i+" is exist");
            }
            else {
                console.warn("quizzes "+i+" not created!");
                console.error(error);
            }
        }
    }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });