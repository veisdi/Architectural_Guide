//загрузки API Яндекс.Карт
ymaps.ready(init);

function init() {
    // Создаём карту
    var myMap = new ymaps.Map('map', {
        center: [59.934280, 30.322760], // центр СПб
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl']
    });

    // Загружаем данные из objects.json
    fetch('./objects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось загрузить objects.json');
            }
            return response.json();
        })
        .then(objects => {
            console.log('Загружено объектов:', objects.length);

            // Проходим по каждому объекту
            objects.forEach(obj => {
                // Создаём маркер
                var placemark = new ymaps.Placemark(obj.coords, {
                    balloonContentHeader: obj.name,
                    balloonContentBody: `
                        <div style="max-width: 200px;">
                            <img src="${obj.photoUrl}" alt="${obj.name}" style="width: 100%; height: auto; margin-bottom: 8px;">
                            <p>${obj.description}</p>
                        </div>
                    `,
                    hintContent: obj.name
                }, {
                    preset: 'islands#blueDotIcon' // можно менять цвет/форму маркера
                });

                // Добавляем маркер на карту
                myMap.geoObjects.add(placemark);
            });

            // Опционально: масштабируем карту под все маркеры
            if (objects.length > 0) {
                myMap.setBounds(myMap.geoObjects.getBounds(), {
                    checkZoomRange: true
                });
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
            alert('Не удалось загрузить данные объектов. Проверьте консоль.');
        });
}
