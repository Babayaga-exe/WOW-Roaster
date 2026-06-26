// UPDATE THIS FILE EACH WEEK WITH NEW ROSTER DATA
// =================================================
// Steps to update:
// 1. Change WEEK_NUMBER and WEEK_DATES below
// 2. Update DAY_LABELS with the new 7 dates (Mon-Sun)
// 3. Edit each advisor's `days` array (length 7, Mon..Sun)
//    Allowed values: a shift time string like "11:30" / "16:00" / "16:30" / "14:30"
//                    OR one of: "WO" (Week Off), "RO" (Roster Off), "AL" (Annual Leave)
// 4. Add/remove advisors as needed - keep the structure intact.

export const WEEK_NUMBER = 27;
export const WEEK_DATES = "29-Jun-26 to 5-Jul-26";

export const DAY_LABELS: { short: string; date: string; full: string }[] = [
  { short: "Mon", date: "29-Jun", full: "Monday 29-Jun-26" },
  { short: "Tue", date: "30-Jun", full: "Tuesday 30-Jun-26" },
  { short: "Wed", date: "1-Jul",  full: "Wednesday 1-Jul-26" },
  { short: "Thu", date: "2-Jul",  full: "Thursday 2-Jul-26" },
  { short: "Fri", date: "3-Jul",  full: "Friday 3-Jul-26" },
  { short: "Sat", date: "4-Jul",  full: "Saturday 4-Jul-26" },
  { short: "Sun", date: "5-Jul",  full: "Sunday 5-Jul-26" },
];

export type DayStatus = string; // "11:30" | "16:00" | "16:30" | "14:30" | "WO" | "RO" | "AL"

export interface Advisor {
  empId: string;
  name: string;
  queue: "DOC" | "Care";
  shift: string;
  days: DayStatus[]; // length 7, Mon..Sun
}

export interface Team {
  leader: string;
  advisors: Advisor[];
}

export const TEAMS: Team[] = [
  {
    leader: "Chanchal Pandey",
    advisors: [
      { empId: "1179708", name: "Prajwal G N", queue: "DOC", shift: "16:30", days: ["16:30","16:30","16:30","16:30","16:30","WO","WO"] },
      { empId: "1179814", name: "Pradeep Kumar Roy", queue: "DOC", shift: "11:30", days: ["11:30","11:30","11:30","11:30","11:30","WO","WO"] },
      { empId: "1183351", name: "Arun Kumar Thomas", queue: "DOC", shift: "16:00", days: ["16:00","16:00","16:00","16:00","16:00","WO","WO"] },
      { empId: "1190532", name: "Monmaya Gurung", queue: "Care", shift: "16:00", days: ["16:00","16:00","16:00","16:00","16:00","WO","WO"] },
      { empId: "1180005", name: "Kolandai Yesu A", queue: "Care", shift: "16:00", days: ["16:00","16:00","16:00","16:00","16:00","WO","WO"] },
      { empId: "1199510", name: "Purnima Thapa", queue: "Care", shift: "16:00", days: ["16:00","16:00","16:00","RO","RO","16:00","16:00"] },
      { empId: "1199557", name: "Nagendra Paib", queue: "Care", shift: "16:30", days: ["16:30","16:30","WO","16:30","16:30","16:30","WO"] },
      { empId: "1199648", name: "Anandi Rajendran", queue: "Care", shift: "16:00", days: ["16:00","16:00","RO","RO","AL","16:00","16:00"] },
      { empId: "1190620", name: "Evangelin Jona", queue: "Care", shift: "11:30", days: ["11:30","11:30","11:30","11:30","11:30","WO","WO"] },
      { empId: "1179566", name: "Suma Dwarkish", queue: "Care", shift: "16:00", days: ["16:00","16:00","16:00","16:00","16:00","WO","WO"] },
      { empId: "1179846", name: "Aswin Premraj", queue: "Care", shift: "16:30", days: ["16:30","16:30","WO","16:30","16:30","16:30","16:30"] },
      { empId: "1179699", name: "Ajaykumar Muraleedharan", queue: "Care", shift: "11:30", days: ["11:30","11:30","WO","11:30","11:30","11:30","WO"] },
    ],
  },
  {
    leader: "Reshma S",
    advisors: [
      { empId: "1190382", name: "Karthik V", queue: "DOC", shift: "11:30", days: ["11:30","11:30","11:30","RO","RO","11:30","11:30"] },
      { empId: "1190379", name: "Jamminthang Baite", queue: "DOC", shift: "11:30", days: ["11:30","11:30","WO","WO","11:30","11:30","11:30"] },
      { empId: "1179802", name: "Joswin Dsilva", queue: "Care", shift: "11:30", days: ["11:30","11:30","WO","WO","11:30","11:30","11:30"] },
      { empId: "1180190", name: "Sharal Peter", queue: "Care", shift: "11:30", days: ["11:30","11:30","WO","WO","11:30","11:30","11:30"] },
      { empId: "1199509", name: "Lavanya Sridhar", queue: "Care", shift: "11:30", days: ["11:30","11:30","WO","WO","11:30","11:30","11:30"] },
      { empId: "1199514", name: "Gangadhar Nagaraj", queue: "Care", shift: "16:00", days: ["16:00","WO","WO","16:00","16:00","16:00","16:00"] },
      { empId: "1199649", name: "Brijesh Rajashekara", queue: "Care", shift: "16:30", days: ["16:30","WO","WO","16:30","16:30","16:30","16:30"] },
      { empId: "1199666", name: "Sonu Basilica S", queue: "Care", shift: "16:00", days: ["16:00","WO","WO","16:00","16:00","16:00","16:00"] },
      { empId: "1179693", name: "Syeda Arbin", queue: "Care", shift: "11:30", days: ["11:30","11:30","WO","WO","11:30","11:30","11:30"] },
      { empId: "1179698", name: "Tanchuiliu", queue: "DOC", shift: "11:30", days: ["11:30","11:30","WO","WO","11:30","11:30","11:30"] },
    ],
  },
  {
    leader: "Sanjay Lakshmanan",
    advisors: [
      { empId: "1190448", name: "Shahana K", queue: "DOC", shift: "14:30", days: ["14:30","RO","RO","14:30","14:30","14:30","14:30"] },
      { empId: "1190512", name: "Soumik Chakraborty", queue: "Care", shift: "11:30", days: ["11:30","WO","11:30","11:30","11:30","11:30","RO"] },
      { empId: "1179812", name: "Manasa M", queue: "Care", shift: "11:30", days: ["11:30","WO","11:30","11:30","WO","11:30","11:30"] },
      { empId: "1199371", name: "Rishab Tiwari", queue: "Care", shift: "11:30", days: ["11:30","WO","11:30","RO","RO","11:30","11:30"] },
      { empId: "1199532", name: "Shlok Chatterjee", queue: "Care", shift: "16:30", days: ["16:30","16:30","16:30","RO","RO","16:30","16:30"] },
      { empId: "1199598", name: "Ranjith Penchalaiah", queue: "Care", shift: "11:30", days: ["11:30","11:30","11:30","RO","RO","11:30","11:30"] },
      { empId: "1199581", name: "Yaashwini Latekrishna", queue: "Care", shift: "16:00", days: ["RO","16:00","16:00","16:00","WO","16:00","16:00"] },
      { empId: "1199597", name: "Nihal Bhaskar", queue: "Care", shift: "16:00", days: ["16:00","16:00","16:00","RO","WO","16:00","16:00"] },
      { empId: "1199585", name: "Rochelle Pereira", queue: "Care", shift: "16:00", days: ["16:00","16:00","16:00","RO","16:00","16:00","16:00"] },
      { empId: "1190561", name: "Mohammed Yusuf Shaikh (DJ)", queue: "DOC", shift: "16:00", days: ["16:00","16:00","WO","16:00","WO","16:00","16:00"] },
      { empId: "1190533", name: "Margaret Rohini", queue: "Care", shift: "11:30", days: ["11:30","11:30","WO","11:30","11:30","11:30","11:30"] },
      { empId: "1190495", name: "Lakshita Premanath", queue: "Care", shift: "11:30", days: ["11:30","11:30","WO","11:30","11:30","11:30","11:30"] },
      { empId: "1179669", name: "Hrithick Rahul", queue: "Care", shift: "16:30", days: ["16:30","16:30","WO","16:30","16:30","16:30","16:30"] },
    ],
  },
];

export const TOTAL_ADVISORS = TEAMS.reduce((n, t) => n + t.advisors.length, 0);
