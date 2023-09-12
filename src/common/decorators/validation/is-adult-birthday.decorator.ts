import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
import { userMinimumAgeInYears } from 'src/user/consts/user-validation-parameter.consts';
  
  @ValidatorConstraint({ async: true })
  export class BirthdayAdult implements ValidatorConstraintInterface {
    constructor() {}
  
    validate(birthdayString: string) {
      try {
        const currentDate = new Date()
        const birthday = new Date(birthdayString)
        const currentYear = currentDate.getFullYear()
        const currentMonth = currentDate.getMonth()
        const currentDay = currentDate.getDate()
        const birthdayYear = birthday.getFullYear()
        const birthdayMonth = birthday.getMonth()
        const birthdayDay = birthday.getDate()

        if ((currentYear - birthdayYear) > userMinimumAgeInYears) {
          return true
        } else if ((currentYear - birthdayYear) === userMinimumAgeInYears && (currentMonth > birthdayMonth || (currentMonth === birthdayMonth && currentDay >= birthdayDay))) {
          return true
        }
        else {
          return false
        }
      } catch(error: any){
        throw new Error
      } 
    }
  }
  
  export function IsAdultBirthday(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: BirthdayAdult,
      });
    };
  }