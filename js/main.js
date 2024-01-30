var menu1 = document.querySelector('#menu1')

for(let i=9; i>1; i--) { 
      menu1.insertAdjacentHTML('beforeend',
      `
      <label class="checkbox-btn">
        <input class="btn-check" type="checkbox" value="1${i-1}">
        <span>1${i-1}</span>
      </label>
      `)
    }

var menu2 = document.querySelector('#menu2')

for(let i=0; i<8; i++) { 
      menu2.insertAdjacentHTML('beforeend',
      `
      <label class="checkbox-btn">
        <input class="btn-check" type="checkbox" value="2${i+1}">
        <span>2${i+1}</span>
      </label>
      `)
    }


var menu3 = document.querySelector('#menu3')

for(let i=0; i<8; i++) { 
      menu3.insertAdjacentHTML('beforeend',
      `
      <label class="checkbox-btn">
        <input class="btn-check" type="checkbox" value="3${i+1}">
        <span>3${i+1}</span>
      </label>
      `)
    }


var menu4 = document.querySelector('#menu4')

for(let i=9; i>1; i--) { 
      menu4.insertAdjacentHTML('beforeend',
      `
      <label class="checkbox-btn">
        <input class="btn-check" type="checkbox" value="4${i-1}">
        <span>4${i-1}</span>
      </label>
      `)
    }




/* Сортировка таблицы слева */
table1.onclick = function (e) {
  if (e.target.tagName != 'TH') return;
  let th = e.target;
  sortTable(th.cellIndex, th.dataset.type, 'table1');
};
/* Сортировка таблицы справа */
table2.onclick = function (e) {
  if (e.target.tagName != 'TH') return;
  let th = e.target;
  sortTable(th.cellIndex, th.dataset.type, 'table2');
};

function sortTable(colNum, type, id) {
  let elem = document.getElementById(id)
  let tbody = elem.querySelector('tbody');
  let rowsArray = Array.from(tbody.rows);
  let compare;
  switch (type) {
    case 'number':
      compare = function (rowA, rowB) {
        return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
      };
      break;
    case 'string':
      compare = function (rowA, rowB) {
        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
      };
      break;
  }
  rowsArray.sort(compare);
  tbody.append(...rowsArray);
}

/* Поиск товаров */
var options = {
  valueNames: [ 'name', 'price' ]
};
var userList

/* Добавить новый товар */
// Модальное окно
var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
  keyboard: false
});

// Добавить счетчик числа товаров в локальное хранилище
if(!localStorage.getItem('goods')) {
  localStorage.setItem('goods', JSON.stringify([]))
}

// Добавить счетчик числа товаров в локальное хранилище
if(!localStorage.getItem('position')) {
  localStorage.setItem('position', JSON.stringify([]))
}


if(!sessionStorage.getItem('dentas')) {
  sessionStorage.setItem('dentas', JSON.stringify([]))
}


//  a = localStorage.getItem('goods');
// a = JSON.stringify(a)
// console.log(a);
// Сохранение нового товара
document.querySelector('button.add_new').addEventListener('click', function(e) {
  let name = document.getElementById('good_name').value
  let price = document.getElementById('good_price').value
  if(name && price) {
    document.getElementById('good_name').value = ''
    document.getElementById('good_price').value = ''
    let goods = JSON.parse(localStorage.getItem('goods'))
    goods.push(['good_'+goods.length, name, price])
    localStorage.setItem('goods', JSON.stringify(goods))
    update_goods() //обновляет содержимое окна в тот момент когда добавляеться новый товар
    myModal.hide() //скрыть модальное окно после нажатия кнопки
  } else {   // вызов диалогового окна с ошибкой о не полностью заполненными полями
    Swal.fire({
      icon: 'error',
      title: 'Ошибка',
      text: 'Пожалуйста заполните все поля!',
    }) 
  }
})

var dentInput




// Обновление отображаемых товаров после перегрузки страници
update_goods();
function update_goods() {  //функция обновления товаров
  let result_price = 0 // результирующая цена
  let tbody = document.querySelector('.list') // Строки с товарами
  let zbody = document.querySelector('.cart')
  tbody.innerHTML = "" // полностью очищаем все что там есть
  zbody.innerHTML = "" // таблица с права тоже обнуляем
  let goods = JSON.parse(localStorage.getItem('goods')) // получение даных с лок хран
  let position = JSON.parse(localStorage.getItem('position'))
  if(goods.length) { //если у нас есть хоть один элемент в лок хран то будем выполнять... или в противном случае будет означать что нет элементов
    table1.hidden = false // отобразить таблицу если есть товары
    table2.hidden = false // отобразить таблицу если есть товары
    for(let i=0; i<goods.length; i++) { 
      //console.log(`${i} = ${goods[i]}`),
      tbody.insertAdjacentHTML('beforeend',
      `
      <tr class="align-middle">
        <td>${i+1}</td>
        <td class="name">${goods[i][1]}</td>
        <td class="price">${goods[i][2]}</td>
        <td><button class="good_delete btn-danger" data-delete="${goods[i][0]}">&#10006;</button></td>
        <td><button class="good_delete btn-primary" data-goods="${goods[i][0]}">&#10149;</button></td>
      </tr>
      `)
    }
        if(position.length) {
        for(let i=0; i<position.length; i++) {
        // Расчитать цену с учетом скидки
        position[i][6] = position[i][2] - position[i][2]*position[i][5]*0.01
        // Сумировать цену в общий результат
        result_price += position[i][6]
        zbody.insertAdjacentHTML('beforeend',
        `
        <tr class="align-middle" id="myInput">
          <td>${i+1}</td>
          <td class="price_name">${position[i][1]}</td>
          <td class="price_one">${position[i][7]}</td>
          <td class="dental">${position[i][4]}</td>
          <td class="price_discount"><input data-goodid="${position[i][0]}" type="text" value="${position[i][5]}" min="0" max="100"></td>
          <td>${position[i][6]}</td>
          <td><button class="good_delete btn-danger" data-delete="${position[i][0]}">&#10006;</button></td>
        </tr>
        `)
        }
      }

    // pusto

    userList = new List('goods', options);
  } else {
    table1.hidden = true
    table2.hidden = true  
  }
  //console.log(result_price)
  // Вывести цену в итог
  document.querySelector('.price_result').innerHTML = result_price + ' &#x20b4;'
}

/* Удаление отдельных товаров */
document.querySelector('.list').addEventListener('click', function(e) {  
  if(!e.target.dataset.delete) {
    return
  }
  Swal.fire({
    title: 'Внимание!',
    text: "Вы действительно хотите удалить?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Да',
    cancelButtonText: 'Отмена',
  }).then((result) => {
    if (result.isConfirmed) {
      let goods = JSON.parse(localStorage.getItem('goods'))
      for(let i=0; i<goods.length; i++) {
        if(goods[i][0] == e.target.dataset.delete) {
          goods.splice(i,1) // удалить товар
          localStorage.setItem('goods', JSON.stringify(goods))
          update_goods()
        }
      }
      Swal.fire(
        'Удалено!',
        'Выбраный товар был успешно удален.',
        'success'
      )
    }
  })
})

var arr = [];
var checkboxs = document.querySelectorAll('.btn-check');
checkboxs.forEach(checkbox => {
    checkbox.onclick = () => {
        var elems = document.querySelectorAll('.btn-check:checked');
        var arr = [].map.call(elems, function(obj) {
            return obj.value;
        });
        if (arr.length >= 1) {
          den = arr
        }else{
          den = []
        }
        let dentas = JSON.parse(sessionStorage.getItem('dentas'))
        sessionStorage.setItem('dentas', JSON.stringify(den))
    }
})

window.onunload = function () {
  sessionStorage.removeItem('dentas');
}

/* Добавление в корзину */
document.querySelector('.list').addEventListener('click', function(e) {  
  if(!e.target.dataset.goods) {
    return
  }
  let goods = JSON.parse(localStorage.getItem('goods'))
  for(let i=0; i<goods.length; i++) {
    if(goods[i][0] == e.target.dataset.goods) {
      let dentas = JSON.parse(sessionStorage.getItem('dentas'))
      let name = goods[i][1]
      let sum = goods[i][2]
      let price 
      if (dentas.length) {
         price = goods[i][2] * dentas.length
      }else{
         price = goods[i][2]
      }
      let dent = dentas
      let position = JSON.parse(localStorage.getItem('position'))
      position.push(['pos_' + position.length, name, price, 0, dent, 0, 0, sum])
      localStorage.setItem('position', JSON.stringify(position))
      update_goods()
    }
  }
})

/* Удаление одного товара из корзины */
document.querySelector('.cart').addEventListener('click', function(e) {  
  if(!e.target.dataset.delete) {
    return
  }
  let position = JSON.parse(localStorage.getItem('position'))
  for(let i=0; i<position.length; i++) {
    if(position[i][0] == e.target.dataset.delete) {
      position.splice(i,1)
      localStorage.setItem('position', JSON.stringify(position))
      update_goods()
    }
  }
})
/* Изменение скидки */
document.querySelector('.cart').addEventListener('input', function(e) {  
  if(!e.target.dataset.goodid) {
    return
  }
  let position = JSON.parse(localStorage.getItem('position'))
  for(let i=0; i<position.length; i++) {
    if(position[i][0] == e.target.dataset.goodid) {
      // Скидка
      position[i][5] = e.target.value
      // Цена со скидкой
      position[i][6] = position[i][2] - position[i][2]*position[i][5]*0.01
      localStorage.setItem('position', JSON.stringify(position))
      update_goods()
      // Поставить фокус в поле скидки и передвинуть курсор в конец
      let input = document.querySelector(`[data-goodid="${position[i][0]}"]`)
      input.focus()
      input.selectionStart = input.value.length;
    }
  }
})

// /* Добавление номера зуба */
// document.querySelector('.cart').addEventListener('input', function(e) {  
//   if(!e.target.dataset.gooddent) {
//     return
//   }
//   let position = JSON.parse(localStorage.getItem('position'))
//   for(let i=0; i<position.length; i++) {
//     if(position[i][0] == e.target.dataset.gooddent) {
//       // dent
//       elem = e.target.value

//       position[i][4] = elem
//       localStorage.setItem('position', JSON.stringify(position))
//       update_goods()
//       // Поставить фокус в поле скидки и передвинуть курсор в конец
//       let input = document.querySelector(`[data-gooddent="${position[i][0]}"]`)
//       input.focus()
//       input.selectionStart = input.value.length;
      
//     }
//   }
// })


// elem.onchange=function(e){
//     var value = parseInt(e.target.value);
//     if(!value || value <11 || value > 18 && value <21 || value > 28 && value <31 || value > 38) {
//         /*Что-то делать.
//           Очищаю поле.
//         */
//         e.target.value = '';
//     }
// }



function CallPrint(strid) {
  var prtContent = document.getElementById(strid);
  var printWindow = window.open('', '', 'height=400,width=800');
  // var prtCSS = '<link rel="stylesheet" href="css/bootstrap.min.css">';
  var prtCSS = '<style type="text/css">table { font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif; font-size: 14px; background: white; max-width: 70%; width: 70%; border-collapse: collapse; text-align: left; } th { font-weight: normal; color: #039; border-bottom: 2px solid #6678b1; padding: 10px 8px; } td { color: #669; padding: 9px 8px; transition: .3s linear; } tr:hover td { color: #6699ff; } .good_delete{ display: none; } input {border:none;}</style>';
  console.log(prtContent.innerHTML);
  printWindow.document.write('<html><head><title>DIV Contents</title>');
  printWindow.document.write(prtCSS);
  printWindow.document.write('</head><body >');
  printWindow.document.write(prtContent.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();

}
