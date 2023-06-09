import json
import requests

endpoint_stage = "http://campfire.ext-it.ru:4081/api/v1/"
endpoint_local = "http://localhost:4081/api/v1/"
headers_stage = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInRva2VuIjoiRUJwVkRmWFRQR2g2dGFNVkJaTzJDNFRveUJHUnR4MXRTQlQyZGo2NlVwMCIsInNlY3VyZV90b2tlbl9wYXJ0X3B1YmxpYyI6ImNlNzFlYTQ2Y2Y1ZTlmNmM3ZDU4NjY0ZiIsInYiOjIsImlhdCI6MTY4NjA2Nzc0MH0.1oyJM37ukqBDy1KH3gpczXv483dDH1Zz1Go7tLYjGxM"}
headers_local = {"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQyLCJ0b2tlbiI6ImktZW5fTk9hVHI3LUFYTnl5Z2E1bXRrd205SkNXY3VkRXJPUVpqRmViQlEiLCJzZWN1cmVfdG9rZW5fcGFydF9wdWJsaWMiOiJjZTcxZWE0NmNmNWU5ZjZjN2Q1ODY2NGYiLCJ2IjoyLCJpYXQiOjE2ODYwNjE0NDd9.OAr9xgxqRNRw9Bl28rz02qjxe4S2Cs_i4U4nWTTNUSk"}

endpoint = endpoint_stage
headers = headers_stage

def input_data():
    data = input("Введите название курса или JSON обьект курса: ")
    pass

def make_json(title, description, icon, background_img, requirements,difficulty,categoryid,categorylabel,lessonsAmount, lessonTitles,lessonDescriptions,lessonImages,video):
    # Список категорий из бэкэнда(порядок имеет значение)
    categories = [
            'Театр',
            'Фортепиано',
            'Гитара',
            'Ударные инструменты',
            'ИЗО',
            'Живопись',
            'Хоровое пение',
            'Хореография',
            'Скрипка',
            'Дизайн',
            'Цирковое искусство',
            'Вокал',
        ]
    
    # указываем сложность
    if(difficulty == 0):
        difficultylabel = "Лёгкий"
    elif(difficulty == 1):
        difficultylabel = "Средний"
    elif(difficulty == 2):
        difficultylabel = "Сложный"
    elif(difficulty == 3):
        difficultylabel = "Супер сложный"
    elif(difficulty == 4):
        difficultylabel = "Невозможный"
    else:
        difficultylabel = "Непонятный"
    
    # автозаполнение сатегорий
    if(categoryid == None):
        categoryid = categories.index(categorylabel)
    if(categorylabel == None):
        categorylabel = categories[categoryid]
    
    # перевод одиночного видео в массив
    videos = []
    for i in range(0,lessonsAmount):
        videos.append(video)

    # первый уровень JSON
    data = {}
    data['title'] = title
    data['description'] = description
    data['active_icon'] = icon
    data['inactive_icon'] = icon
    data['requirements'] = requirements
    data['dificulty'] = difficulty
    data['difficultylabel'] = difficultylabel
    data['categoryid'] = categoryid
    data['categorylabel'] = categorylabel
    data['mime_type_icons'] = "image/png"
    data["mime_type_background_img"] = "image/png"
    data['background_img'] = background_img

    #заполняем урок
    data['stages'] = []
    for i in range(0,lessonsAmount):
        data['stages'].append({})
        data['stages'][i]['courceid'] = -1
        data['stages'][i]['description'] = lessonDescriptions[i]
        data['stages'][i]['title'] = lessonTitles[i]
        data['stages'][i]['type'] = "Video"
        data['stages'][i]['mime_type_coverimage'] = "video/url"
        data['stages'][i]['coverimage'] = lessonImages[i]
        data['stages'][i]['lessions'] = []
        data['stages'][i]['lessions'].append({})
        data['stages'][i]['lessions'][0]['stageid'] = -1
        data['stages'][i]['lessions'][0]['mimetype'] = "video/url"
        data['stages'][i]['lessions'][0]['url'] = videos[i]
        data['stages'][i]['lessions'][0]['text'] = ""
        pass
    return data

if(__name__ == "__main__"):

    # ----- обязательные поля -------
    title = "Ноты. Основы"
    description = "Курс  Ноты. Основы предназначен для начинающих музыкантов, которые хотят изучить основы игры на скрипке и научиться читать ноты. В рамках курса вы познакомитесь с основами музыкальной теории и техникой игры на скрипке, научитесь читать ноты и играть простые мелодии. Курс состоит из нескольких модулей, каждый из которых посвящен определенной теме. В первых модулях вы изучите основные элементы музыкальной теории, такие как ноты, знаки, длительности и т.д. Вы также познакомитесь с основами игры на скрипке, включая приемы держания инструмента, поз"
    icon = "http://campfire.ext-it.ru:4088/4786674861785123-emojione-v1_musical-notes.png"
    background_img = "https://images.unsplash.com/photo-1566913485233-a9b2afe13757?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80"
    requirements = "Желание изучить основы игры на скрипке и умение читать ноты. Никаких специальных знаний и навыков не требуется, курс подходит для начинающих музыкантов."
    difficulty = 0
    categoryid = 8
    categorylabel = "Скрипка"
    lessonsAmount = 5
    lessonTitles = ["Введение в музыку и история скрипки", "Основы музыкальной теории", "Ноты и их значения", "Держание скрипки и игра на открытых струнах", "Игра на первой позиции"]
    lessonDescriptions = [ "В первом уроке вы ознакомитесь с историей скрипки, ее строением и основными элементами музыкальной теории. Вы также узнаете, как правильно держать скрипку и смысл нотации на листе музыки.", "В этом уроке вы изучите основные элементы музыкальной теории, такие как тональность и ритм. Вы также научитесь играть ритмические фигуры на скрипке.", "В этом уроке вы изучите ноты и их значения, а также научитесь читать ноты на листе музыки. Вы также познакомитесь с аккордами и их использованием в музыке.", "В этом уроке вы научитесь держать скрипку и играть на открытых струнах. Вы также изучите приемы левой руки и узнаете, как правильно настраивать скрипку.", "В этом уроке вы научитесь играть на первой позиции на скрипке. Вы изучите различные приемы левой и правой руки, а также научитесь играть простые мелодии." ]
    lessonImages = ["https://images.unsplash.com/photo-1585263547501-7e5a0c222010?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80", "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80", "https://images.unsplash.com/photo-1601375863404-5b912f4536df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80", "https://images.unsplash.com/photo-1492563817904-5f1dc687974f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80", "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1298&q=80"]

    video = "http://campfire.ext-it.ru:4088/5721713452426673-Rick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up%20%28Official%20Music%20Video%29.mp4"
    # -------------------------------

    # создаем нужный формат из данных
    data = make_json(title,description,icon,background_img,requirements,difficulty,categoryid,categorylabel,lessonsAmount,lessonTitles,lessonDescriptions,lessonImages,video)

    #что-то не особо нужное(legacy)
    isJson = False
    if(type(data) is str):
        json_data = {}
        try:
            json_data = json.loads(data)
            isJson = json_data != None
        except Exception as e:
            isJson = False
            pass
    if(type(data) is dict):
        json_data = data.copy()
        isJson = True
    
    if(isJson):
        try:
            data = json_data.copy()
            del data['stages']
            print("json_data: ",json_data)
            course = requests.post(endpoint+"course/course", data=json_data, headers=headers)
            print("course: ",course.text)
            for i in range(0, len(json_data['stages'])):
                data = json_data['stages'][i].copy()
                del data['lessions']
                data['courceid'] = json.loads(course.text)['data']['id']
                stage = requests.post(endpoint+"course/stage", data=data,headers=headers)
                print("stage: ",stage.text)
                for j in range(0,len(json_data['stages'][i]['lessions'])):
                    data = json_data['stages'][i]['lessions'][j].copy()
                    data['stageid'] = json.loads(stage.text)['data']['id']
                    lession = requests.post(endpoint+"course/lession",data=data,headers=headers)
                    print("lession: ",lession.text)
                    pass
                pass
        except Exception as e:
            print(e)
            print("data is incorrect!")
            pass
        pass
    else:
        answer:str = input("Это был не JSON? Если да, то просто нажмите любую клавишу, если все таки JSON, то в нем ошибка. Нажмите кнопку \'N\': ")
        if(answer.lower() == 'n'):
            exit()
        
        
    pass
