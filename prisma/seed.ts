import { PrismaClient, BookingStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { addDays, setHours, setMinutes } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("بدء إضافة البيانات الأولية...");

  // Create admin user (email: admin@clinic.com, password: admin123)
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@clinic.com" },
    update: {},
    create: {
      email: "admin@clinic.com",
      password: hashedPassword,
      name: "مدير النظام",
    },
  });
  console.log("✓ تم إنشاء حساب المدير (admin@clinic.com / admin123)");

  // Create Arabic services - Dr. Nader Hammad's specialized services
  const services = [
    {
      name: "جلسات علاج طبيعي",
      description: "علاج طبيعي متخصص للإصابات والآلام المزمنة",
      duration: 45,
      price: 100,
    },
    {
      name: "جلسات الإبر الصينية",
      description: "علاج بالإبر الصينية التقليدية لتخفيف الألم وتحسين الصحة",
      duration: 40,
      price: 100,
    },
    {
      name: "جلسات الكايروبراكتيك",
      description: "تقويم العمود الفقري والمفاصل بتقنيات متخصصة",
      duration: 30,
      price: 100,
    },
    {
      name: "جلسات الرفلوكسولوجي",
      description: "علاج انعكاسي بالضغط على نقاط محددة في القدمين",
      duration: 40,
      price: 100,
    },
    {
      name: "جلسات السياتشو",
      description: "تدليك علاجي ياباني تقليدي لتحسين تدفق الطاقة",
      duration: 50,
      price: 100,
    },
    {
      name: "جلسات السوجوك",
      description: "علاج كوري تقليدي بالضغط على نقاط اليدين والقدمين",
      duration: 35,
      price: 100,
    },
    {
      name: "جلسات الحجامة",
      description: "علاج بالحجامة الرطبة والجافة حسب الحالة",
      duration: 40,
      price: 75,
    },
    {
      name: "جلسات سم النحل",
      description: "علاج متخصص باستخدام سم النحل الطبيعي",
      duration: 30,
      price: 75,
    },
    {
      name: "جلسات تقويم العمود الفقري",
      description: "تقويم وضبط العمود الفقري لتحسين الوضعية",
      duration: 35,
      price: 150,
    },
    {
      name: "جلسات علاج الفقرات العنقية",
      description: "علاج متخصص لآلام الرقبة والفقرات العنقية",
      duration: 40,
      price: 100,
    },
    {
      name: "جلسات علاج عرق النسا",
      description: "علاج فعال لألم عرق النسا والعصب الوركي",
      duration: 45,
      price: 100,
    },
    {
      name: "جلسات علاج الجلطات الدماغية",
      description: "تأهيل وعلاج ما بعد الجلطات الدماغية",
      duration: 60,
      price: 150,
    },
    {
      name: "جلسات علاج الكهرباء الزائدة",
      description: "علاج الكهرباء الزائدة في الجسم والأعصاب",
      duration: 40,
      price: 100,
    },
    {
      name: "جلسات علاج خشونة الركبة",
      description: "علاج متخصص لخشونة الركبة والمفاصل",
      duration: 40,
      price: 75,
    },
    {
      name: "جلسات التأهيل الحركي الشامل",
      description: "برنامج تأهيل حركي شامل لاستعادة الوظائف الحركية",
      duration: 60,
      price: 150,
    },
    {
      name: "جلسات التأهيل بعد العمليات",
      description: "تأهيل متخصص بعد العمليات الجراحية",
      duration: 50,
      price: 75,
    },
    {
      name: "جلسات الاستشفاء",
      description: "جلسات استشفاء وتعافي للجسم والعضلات",
      duration: 45,
      price: 75,
    },
    {
      name: "جلسات علاج القولون العصبي",
      description: "علاج طبيعي للقولون العصبي والمشاكل الهضمية",
      duration: 40,
      price: 75,
    },
    {
      name: "جلسات علاج انسداد أعصاب اليدين",
      description: "علاج متخصص لمتلازمة النفق الرسغي وانسداد الأعصاب",
      duration: 35,
      price: 75,
    },
    {
      name: "جلسات علاج الجيوب الأنفية",
      description: "علاج طبيعي فعال لالتهاب الجيوب الأنفية",
      duration: 30,
      price: 75,
    },
    {
      name: "جلسات علاج تقوس العمود الفقري",
      description: "علاج الجنف وتقوس العمود الفقري",
      duration: 50,
      price: 100,
    },
    {
      name: "التغذية العلاجية",
      description: "استشارات تغذية علاجية متخصصة وبرامج غذائية",
      duration: 40,
      price: 50,
    },
    {
      name: "جلسات الميزوثيرابي",
      description: "حقن الميزوثيرابي للبشرة والشعر",
      duration: 30,
      price: 150,
    },
    {
      name: "جلسات البلازما",
      description: "علاج بالبلازما الغنية بالصفائح الدموية",
      duration: 40,
      price: 150,
    },
    {
      name: "جلسات البوتكس",
      description: "حقن البوتكس التجميلية والعلاجية",
      duration: 25,
      price: 500,
    },
    {
      name: "جلسات الفيلر",
      description: "حقن الفيلر لنضارة البشرة وملء التجاعيد",
      duration: 30,
      price: 500,
    },
    {
      name: "جلسات الفوطة النارية",
      description: "علاج تقليدي بالفوطة النارية للعضلات والمفاصل",
      duration: 35,
      price: 100,
    },
  ];

  // Delete existing bookings and services first (for re-seeding)
  await prisma.booking.deleteMany({});
  await prisma.service.deleteMany({});

  // Create services
  const createdServices = [];
  for (const service of services) {
    const created = await prisma.service.create({
      data: service,
    });
    createdServices.push(created);
  }
  console.log("✓ تم إضافة الخدمات العلاجية");

  // Create sample patients
  const patients = [
    {
      firstName: "أحمد",
      lastName: "محمود",
      email: "ahmed.mahmoud@example.com",
      phone: "01012345678",
      dateOfBirth: new Date("1985-05-15"),
      bloodType: "O+",
      allergies: "حساسية من البنسلين",
      emergencyContact: "زوجة - منى محمود",
      emergencyPhone: "01012345679",
      generalNotes: "مريض منتظم - يعاني من آلام الظهر المزمنة",
    },
    {
      firstName: "فاطمة",
      lastName: "علي",
      email: "fatima.ali@example.com",
      phone: "01098765432",
      dateOfBirth: new Date("1990-08-22"),
      bloodType: "A+",
      chronicConditions: "ضغط دم مرتفع",
      emergencyContact: "زوج - علي حسن",
      emergencyPhone: "01098765433",
      generalNotes: "زيارات دورية كل 3 أشهر",
    },
    {
      firstName: "مريم",
      lastName: "حسن",
      email: "maryam.hassan@example.com",
      phone: "01055555555",
      dateOfBirth: new Date("2018-03-10"),
      bloodType: "B+",
      emergencyContact: "والدة - سارة حسن",
      emergencyPhone: "01055555556",
      generalNotes: "طفلة بصحة جيدة - فحوصات روتينية",
    },
    {
      firstName: "خالد",
      lastName: "سعيد",
      email: "khaled.saeed@example.com",
      phone: "01011112222",
      dateOfBirth: new Date("1978-12-05"),
      bloodType: "AB+",
      chronicConditions: "ربو خفيف",
      emergencyContact: "أخ - أحمد سعيد",
      emergencyPhone: "01011112223",
    },
    {
      firstName: "سارة",
      lastName: "إبراهيم",
      email: "sara.ibrahim@example.com",
      phone: "01022223333",
      dateOfBirth: new Date("1982-06-18"),
      bloodType: "O-",
      allergies: "حساسية من المكسرات",
      emergencyContact: "زوج - محمد إبراهيم",
      emergencyPhone: "01022223334",
      generalNotes: "فحص شامل سنوي منتظم",
    },
    {
      firstName: "محمد",
      lastName: "عبدالله",
      email: "mohamed.abdullah@example.com",
      phone: "01033334444",
      dateOfBirth: new Date("1975-09-30"),
      bloodType: "A-",
      chronicConditions: "سكري من النوع الثاني",
      emergencyContact: "ابن - أحمد محمد",
      emergencyPhone: "01033334445",
      generalNotes: "متابعة دورية بعد عملية جراحية في القلب",
    },
    {
      firstName: "نادية",
      lastName: "أحمد",
      email: "nadia.ahmed@example.com",
      phone: "01044445555",
      dateOfBirth: new Date("1968-04-12"),
      bloodType: "B-",
      chronicConditions: "سكري من النوع الأول، ضغط دم",
      allergies: "حساسية من الأسبرين",
      emergencyContact: "ابنة - مها أحمد",
      emergencyPhone: "01044445556",
      generalNotes: "مريضة سكري منذ 20 سنة - تحتاج متابعة دقيقة",
    },
    {
      firstName: "عمر",
      lastName: "يوسف",
      email: "omar.yousef@example.com",
      phone: "01055556666",
      dateOfBirth: new Date("1995-11-25"),
      bloodType: "O+",
      emergencyContact: "والد - يوسف علي",
      emergencyPhone: "01055556667",
    },
  ];

  const createdPatients = [];
  for (const patient of patients) {
    const created = await prisma.patient.create({
      data: patient,
    });
    createdPatients.push(created);
  }
  console.log("✓ تم إضافة المرضى");

  // Create sample bookings with patient relationships
  const today = new Date();
  const cities = ["بنغازي", "اجدابيا", "سبها", "مصراته", "طرابلس"];
  const bookings = [
    {
      patientId: createdPatients[0]!.id,
      serviceId: createdServices[0]!.id, // استشارة عامة
      city: cities[0]!,
      date: addDays(today, 1),
      startTime: setMinutes(setHours(addDays(today, 1), 10), 0),
      endTime: setMinutes(setHours(addDays(today, 1), 10), 30),
      notes: "أول زيارة - ألم في الظهر",
      status: BookingStatus.PENDING,
    },
    {
      patientId: createdPatients[1]!.id,
      serviceId: createdServices[0]!.id,
      city: cities[1]!,
      date: addDays(today, 1),
      startTime: setMinutes(setHours(addDays(today, 1), 11), 0),
      endTime: setMinutes(setHours(addDays(today, 1), 11), 30),
      notes: "فحص دوري",
      status: BookingStatus.CONFIRMED,
    },
    {
      patientId: createdPatients[2]!.id,
      serviceId: createdServices[2]!.id, // رعاية الأطفال
      city: cities[2]!,
      date: addDays(today, 2),
      startTime: setMinutes(setHours(addDays(today, 2), 9), 0),
      endTime: setMinutes(setHours(addDays(today, 2), 9), 30),
      notes: "فحص روتيني",
      status: BookingStatus.CONFIRMED,
    },
    {
      patientId: createdPatients[3]!.id,
      serviceId: createdServices[3]!.id, // التطعيمات
      city: cities[3]!,
      date: addDays(today, 2),
      startTime: setMinutes(setHours(addDays(today, 2), 14), 0),
      endTime: setMinutes(setHours(addDays(today, 2), 14), 15),
      notes: "تطعيم ضد الإنفلونزا",
      status: BookingStatus.PENDING,
    },
    {
      patientId: createdPatients[4]!.id,
      serviceId: createdServices[4]!.id, // الفحص الشامل
      city: cities[4]!,
      date: addDays(today, 3),
      startTime: setMinutes(setHours(addDays(today, 3), 10), 0),
      endTime: setMinutes(setHours(addDays(today, 3), 10), 45),
      notes: "فحص شامل سنوي",
      status: BookingStatus.CONFIRMED,
    },
    {
      patientId: createdPatients[5]!.id,
      serviceId: createdServices[1]!.id, // زيارة متابعة
      city: cities[0]!,
      date: addDays(today, 3),
      startTime: setMinutes(setHours(addDays(today, 3), 15), 0),
      endTime: setMinutes(setHours(addDays(today, 3), 15), 20),
      notes: "متابعة بعد العملية الجراحية",
      status: BookingStatus.CONFIRMED,
    },
    {
      patientId: createdPatients[6]!.id,
      serviceId: createdServices[5]!.id, // إدارة الأمراض المزمنة
      city: cities[1]!,
      date: addDays(today, 4),
      startTime: setMinutes(setHours(addDays(today, 4), 11), 0),
      endTime: setMinutes(setHours(addDays(today, 4), 11), 40),
      notes: "متابعة السكري",
      status: BookingStatus.PENDING,
    },
    {
      patientId: createdPatients[7]!.id,
      serviceId: createdServices[0]!.id, // استشارة عامة
      city: cities[2]!,
      date: addDays(today, 5),
      startTime: setMinutes(setHours(addDays(today, 5), 9), 30),
      endTime: setMinutes(setHours(addDays(today, 5), 10), 0),
      notes: "صداع مستمر منذ أسبوع",
      status: BookingStatus.PENDING,
    },
  ];

  for (const booking of bookings) {
    await prisma.booking.create({
      data: booking,
    });
  }
  console.log("✓ تم إضافة الحجوزات التجريبية");

  // Create video reviews
  const videoReviews = [
    {
      patientId: createdPatients[0]!.id,
      patientName: "أحمد محمود",
      videoUrl: "/videos/patient-1.mp4",
      treatment: "علاج العمود الفقري",
      title: "تحسن ملحوظ بعد جلسات العلاج الطبيعي",
      isActive: true,
      order: 1,
    },
    {
      patientId: createdPatients[1]!.id,
      patientName: "فاطمة علي",
      videoUrl: "/videos/patient-2.mp4",
      treatment: "الإبر الصينية",
      title: "تجربتي مع الإبر الصينية لعلاج آلام الركبة",
      isActive: true,
      order: 2,
    },
    {
      patientId: createdPatients[2]!.id,
      patientName: "مريم حسن",
      videoUrl: "/videos/patient-3-1.mp4",
      treatment: "التأهيل الحركي",
      title: "رحلة التعافي مع العلاج الطبيعي",
      isActive: true,
      order: 3,
    },
    {
      patientId: createdPatients[2]!.id,
      patientName: "مريم حسن",
      videoUrl: "/videos/patient-3-2.mp4",
      treatment: "التأهيل الحركي",
      title: "نتائج العلاج بعد 6 أشهر",
      isActive: true,
      order: 4,
    },
  ];

  for (const videoReview of videoReviews) {
    await prisma.videoReview.create({
      data: videoReview,
    });
  }
  console.log("✓ تم إضافة مراجعات الفيديو");

  console.log("✅ اكتملت عملية إضافة البيانات الأولية بنجاح!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
