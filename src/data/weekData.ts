import { weeks } from "@/data";
import { useState } from "react";

const [selectedWeek, setSelectedWeek] = useState(28);

const currentWeek = weeks[selectedWeek];
