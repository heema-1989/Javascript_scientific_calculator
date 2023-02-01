var text = "",
  final = "";
var opt = ["(", ")", "/", "*", "+", "-", "%", "^", "|","!"],
  op_array = [],
  operand = [],
  stack = [],
  post_exp = [];
var token, exp;

//This function is for displaying the data on input screen when user presses button.
function displayData(x) 
{
  text += x;
  document.getElementById("result").value = text;
}
//This function checks whether the input string contains any operators or not.
function checkOperator(x) 
{
  for (let i = 0; i < opt.length; i++) 
  {
    if (x == opt[i]) 
    {
      return true;
    }
  }
  return false;
}
//This function iterates through the operand array and returns true only if operand is a number only and returns false if it includes other functions lie log,ln..
function isOperand(x) 
{
  for (let i = 0; i < operand.length; i++) 
  {
    if (x == "Π") 
    {
      return false;
    } 
    else if (x == "e") 
    {
      return false;
    } 
    else if (x == "log") 
    {
      return false;
    } 
    else if (x == "exp") 
    {
      return false;
    } 
    else if (x == "ln") 
    {
      return false;
    } 
    else if (x == operand[i]) 
    {
      return true;
    }
  }
  return false;
}
//This function provides the final expression to be evaluated as a sequence of array elements.
function finalArray() 
{
  token = text.split(/\+|\-|\*|\/|\(|\)|\%|\^|\||\!/);
  /*This part iterates through the input string and checks for operators using checkOperator 
  function defined above and pushes the operators in op_array.*/
  for (let i in text) 
  {
    if (checkOperator(text[i])) 
    {
      op_array.push(text[i]);
    }
  }
  /*This part iterates through the token and checks for operands 
  so that only operands are pushed into operand array and not empty string item.*/
  for (let i in token) 
  {
    if (token[i] != " ") 
    {
      operand.push(token[i]);
    }
  }
  for (let i = 0; i < op_array.length; i++) 
  {
    if (token[i] != "") 
    {
      final += token[i] + " " + op_array[i] + " ";
    } 
    else 
    {
      final += op_array[i] + " ";
    }
  }
  final += token[token.length - 1];
  exp = final.split(" ");
  for (let i = 0; i < exp.length; i++) 
  {
    if (exp[i] == "") 
    {
      exp.splice(i, 1);
    }
  }
}
//This function checks the precedence of the operator. Here the operators with higher precedence will return greater value.
function hasPrecedence(op) 
{
  if (op == "(" || op == ")") 
  {
    return 4;
  }
  if (op == "+" || op == "-") return 1;
  if (op == "*" || op == "/") return 2;
  if (op == "%" || op == "^") return 3;
  return 0;
}
//This function performs the required operations on the values.
function applyOp(op, b, a) 
{
  switch (op) 
  {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      if (b == 0) 
      {
        document.getElementById("result").value = "NaN";
      }
      return parseFloat(a / b);
    case "%":
      return a % b;
    case "^":
      return a ** b;
  }
  return 0;
}
//This function evaluates the expression uisng infix evaluation.
function evaluate(tokens) 
{
  for (let i = 0; i < tokens.length; i++) 
  {
    if (tokens[i] == "") 
    
    {
      continue;
    }
    if (isOperand(tokens[i])) 
    
    {
      post_exp.push(parseFloat(tokens[i]));
    } 
    else if (tokens[i] == "Π") 
    {
      post_exp.push(Math.PI);
    } 
    else if (tokens[i] == "e") 
    {
      post_exp.push(Math.E);
    } 
    else if (tokens[i] == "log") 
    {
      //this part calculates the logarithm with base 10 of a number.
      i += 2;
      post_exp.push(Math.log10(parseFloat(tokens[i])));
      i += 1;
    } 
    else if (tokens[i] == "ln") 
    {
      //this part calculates the logarithm of base e of a number.
      i += 2;
      post_exp.push(Math.log(parseFloat(tokens[i])));
      i += 1;
    } 
    else if (tokens[i] == "exp") 
    {
      //this part gives the exp i.e. e to the power of a number.
      i += 2;
      post_exp.push(Math.exp(parseFloat(tokens[i])));
      i += 1;
    } 
    //This part calculates the absolute value i.e. mod of a number.
    else if (tokens[i] == "|") 
    {
      let temp = "",
        flag,
        mod = "";
      i++;
      while (tokens[i] != "|") 
      {
        temp += tokens[i] + " ";
        i++;
      }
      flag = temp.split(" ");
      if (flag.length <= 3) 
      {
        //this part calculates the absolute value of a single number.
        for (let i = 0; i < flag.length - 1; i++) 
        {
          mod += flag[i];
        }
        post_exp.push(Math.abs(parseFloat(mod)));
      } 
      
      else
      {
        //this part calculates the abs value of an arithmetic expression.
        post_exp.push(Math.abs(evaluate(temp)));
      }
    } 
    else if (tokens[i]== '!')
    
    {
      //This part calculates the factorial of a number.
      let res,fact;
      fact=parseFloat(tokens[i-1]);
      console.log(fact);
      res=fact;
      
      if(fact==0 || fact==1)
      
      {
        return 1;
      }
      while(fact!=1)
      
      {
        fact-=1;
        res=res*fact;
        console.log(res);
      }
      
      post_exp.push(res);
    }
    else if (tokens[i] == "(") 
    {
      stack.push(tokens[i]);
    } 
    else if (tokens[i] == ")") 
    {
      while (stack[stack.length - 1] != "(") 
      {
        post_exp.push(applyOp(stack.pop(), post_exp.pop(), post_exp.pop()));
      }
      stack.pop();
    } 
    else if (
      tokens[i] == "+" ||
      tokens[i] == "-" ||
      tokens[i] == "*" ||
      tokens[i] == "/" ||
      tokens[i] == "%" ||
      tokens[i] == "^"
    ) 
    {
      while (
        stack.length > 0 &&
        stack[stack.length - 1] != "(" &&
        hasPrecedence(tokens[i]) <= hasPrecedence(stack[stack.length - 1])
      ) 
      {
        post_exp.push(applyOp(stack.pop(), post_exp.pop(), post_exp.pop()));
      }
      stack.push(tokens[i]);
    }
  }
  while (stack.length > 0) 
  {
    post_exp.push(applyOp(stack.pop(), post_exp.pop(), post_exp.pop()));
  }
  return post_exp.pop();
}
//This function clears all data from the input screen.
function clearAllData() 
{
  document.getElementById("result").value = "";
  text = "";
  final = "";
  post_exp = [];
  op_array = [];
  operand = [];
  stack = [];
}
//This function erases the last character form input screen.
function backspace() 
{
  document.getElementById("result").value = text.slice(0, -1);
  text = text.slice(0, -1);
}
let memory=0, str;
//This function clears the memory and sets its value to 0.
function memory_clear()

{
  memory=0;
}
//This function stores the display result in memory.
function memory_store()

{
  memory=parseFloat(document.getElementById('result').value);
  //console.log(memory);
}
//This function displays the memory result. The MR button will used to perform any operation on the previously stored values. 
function memory_recall()

{
  text+=memory;
}
//function for M+
function memory_plus()

{
  memory+=parseFloat(document.getElementById('result').value);  
  
}
//function for M-
function memory_minus()

{
  memory-=parseFloat(document.getElementById('result').value);
}
const ascii_val=[48,49,50,51,52,53,54,55,56,57,61,37,40,41,42,43,45,46,47,94,124];

function checkPressedKey(e)
{
  let val= (e.which)? e.which:e.keycode;
  console.log(val);
  for(let i=0; i<ascii_val.length; i++)
  {
    if(ascii_val[i]==val)
    {
      return true;
    }
  }
  return false;
}
function keyPress(e)
{
  text= e;
}
//This function is called when user presses the final equals button.
function calculate_data() 
{
  checkOperator();
  finalArray();
  memory_store();
  memory_recall();
  memory_plus();
  console.log(exp);
  document.getElementById("result").value = evaluate(exp);
}
