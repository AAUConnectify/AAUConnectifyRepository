// seed.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Student, StudentDocument, StudentSchema } from '../schemas/student.schema';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const studentsData = [
      { studentId: 'UGR/1649/12', password: '1234' },
      { studentId: 'UGR/1649/13', password: '5678' },
      { studentId: 'UGR/1649/14', password: 'abcd' },
      { studentId: 'UGR/1649/15', password: 'efgh' },
      { studentId: 'UGR/1649/16', password: 'ijkl' },
      { studentId: 'UGR/1649/17', password: 'mnop' },
      { studentId: 'UGR/1649/18', password: 'qrst' },
      { studentId: 'UGR/1649/19', password: 'uvwx' },
      { studentId: 'UGR/1649/20', password: 'yz12' },
      { studentId: 'UGR/1649/21', password: '3456' },
    ];

    const hashedStudents = await Promise.all(
      studentsData.map(async (student) => {
        const hashedPassword = await bcrypt.hash(student.password, 10);
        return { ...student, password: hashedPassword };
      })
    );

    const studentModel = app.get('Student');
    await studentModel.insertMany(hashedStudents);

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await app.close();
  }
}

seed();
