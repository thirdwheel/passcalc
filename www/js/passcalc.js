document.addEventListener("deviceready", this.pc_odr, false);

var db;
var init_stage = 0;
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_@" // Allowed characters
var init_stop = false;
function pc_odr () 
{
  //alert("doing database thingy")
  db = window.openDatabase("PassCalc", "1.0", "Password Calculator", 1024);
  db.transaction(pc_populate, pc_init_error, pc_init_success);
}

function pc_populate (tx) 
{
  try
  {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_@"
    var count = chars.length
    var passhash = ""
    while (count > 0) 
    {
      var iChar = Math.floor(Math.random() * count)
      var cChar = chars.charAt(iChar);
      chars = chars.substring(0, iChar) + chars.substring(iChar + 1,count);
      count = chars.length
      //alert(count);
      passhash += cChar
    }
    //init_stage++;
    //tx.executeSql("DROP TABLE IF EXISTS Settings");
    init_stage++;
    tx.executeSql("CREATE TABLE Settings (setting_key unique, setting_value)", [], pc_noop, pc_already);
    init_stage++;
    tx.executeSql("INSERT INTO Settings VALUES('passhash', '" + passhash + "')", [], pc_noop, pc_noop);
  } catch (e) {
    alert(e.message)
  }
}

function pc_noop ()
{
  init_stop = true;
  return true;
}
function pc_error (err)
{
  alert("Oops - the database told me: " + err.message)
}
function pc_init_error (err)
{
  //alert("Oops - while setting up at stage " + init_stage + " the database told me: " + err.message)
}
function pc_already (err)
{
  pc_init_success()
}
function pc_init_success ()
{
  //db.transaction(pc_test, pc_error);
}

function pc_test (tx)
{
  tx.executeSql("SELECT setting_value FROM Settings where setting_key = 'passhash'", [], pc_results, pc_error);
}


function pc_results (tx, results)
{
  passhash=results.rows.item(0).setting_value;
  var url = document.getElementById('url').value
  var i   = 0
  var urlL = url.length
  var pass = ""
  while (i < urlL)
  {
    pass += passhash.charAt(chars.indexOf(url.charAt(i++)));
    //url=url.substring(1,url.length);
  }
  var hasPunct = 0;
  var i = chars.length - 4
  while (i < chars.length)
  {
    if (pass.indexOf(chars.charAt(i++)) >= 0)
      hasPunct += 1;
  }
  //alert(hasPunct)
  if (hasPunct == 0) // i.e. no punctuation at all
  {
    pass += chars.charAt(chars.length - 4 + (pass.length % 4))
  }
  alert("Password for " + url + " is " + pass)
}