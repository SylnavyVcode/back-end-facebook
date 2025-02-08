/**
 * @author Sylnavy Valmy Mabika
 * generation d'un code de validation
 *
 * @returns {string}
 */
export const generateCodeOTP = (): string => {
  console.log("<>>>>>>>>>>>><step A");
  
  let valeur = {
    valeur1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    valeur2: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    valeur3: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    valeur4: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    valeur5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    valeur6: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  };

  let code_value = {
    a: valeur.valeur1[parseInt(Math.random() * 9 + 1 + '')],
    b: valeur.valeur2[parseInt(Math.random() * 9 + 1 + '')],
    c: valeur.valeur3[parseInt(Math.random() * 9 + 1 + '')],
    d: valeur.valeur4[parseInt(Math.random() * 9 + 1 + '')],
    e: valeur.valeur5[parseInt(Math.random() * 9 + 1 + '')],
    f: valeur.valeur6[parseInt(Math.random() * 9 + 1 + '')],
  };
  console.log(
    '=========result code',
    `${code_value.a}${code_value.b}${code_value.c}${code_value.d}${code_value.e}${code_value.f}`,
  );

  return `${code_value.a}${code_value.b}${code_value.c}${code_value.d}${code_value.e}${code_value.f}`;
};
