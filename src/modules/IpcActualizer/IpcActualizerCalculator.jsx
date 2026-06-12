import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { 
  TrendingDown, HelpCircle, Download, Printer, Share2, 
  TrendingUp, TableProperties, Scale, Calendar, BookOpen
} from 'lucide-react';
import FinancialInput from '../../components/FinancialInput';
import HelpModal from '../../components/HelpModal';
import AdvisorCTA from '../../components/AdvisorCTA';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';

const formatCurrencyFull = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

const formatPercent = (val) => `${val.toFixed(1)}%`;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '180px' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{label}</p>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '0.15rem' }}>
            <span style={{ color: entry.color, fontSize: '0.85rem' }}>{entry.name}:</span>
            <strong style={{ fontSize: '0.85rem' }}>
              {entry.name.includes('Poder') ? `$${entry.value.toLocaleString('es-AR', { maximumFractionDigits: 0 })}` : `${entry.value.toFixed(1)}%`}
            </strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const IpcActualizerCalculator = () => {
  const navigateToArticle = (articleId) => {
    const url = new URL(window.location.href);
    url.searchParams.set('seccion', 'educacion');
    url.searchParams.set('articulo', articleId);
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new CustomEvent('change-tab', { detail: 'educacion' }));
  };

  const queryParams = new URLSearchParams(window.location.search);

  // Raw INDEC / alternative monthly inflation rates (%)
  const monthlyRates = useMemo(() => [
    // 2003
    { year: 2003, month: 1, rate: 1.3, monthName: 'Ene' },
    { year: 2003, month: 2, rate: 0.6, monthName: 'Feb' },
    { year: 2003, month: 3, rate: 0.6, monthName: 'Mar' },
    { year: 2003, month: 4, rate: 0.1, monthName: 'Abr' },
    { year: 2003, month: 5, rate: -0.4, monthName: 'May' },
    { year: 2003, month: 6, rate: -0.1, monthName: 'Jun' },
    { year: 2003, month: 7, rate: 0.4, monthName: 'Jul' },
    { year: 2003, month: 8, rate: 0, monthName: 'Ago' },
    { year: 2003, month: 9, rate: 0, monthName: 'Sep' },
    { year: 2003, month: 10, rate: 0.6, monthName: 'Oct' },
    { year: 2003, month: 11, rate: 0.2, monthName: 'Nov' },
    { year: 2003, month: 12, rate: 0.2, monthName: 'Dic' },
    // 2004
    { year: 2004, month: 1, rate: 0.4, monthName: 'Ene' },
    { year: 2004, month: 2, rate: 0.1, monthName: 'Feb' },
    { year: 2004, month: 3, rate: 0.6, monthName: 'Mar' },
    { year: 2004, month: 4, rate: 0.9, monthName: 'Abr' },
    { year: 2004, month: 5, rate: 0.7, monthName: 'May' },
    { year: 2004, month: 6, rate: 0.6, monthName: 'Jun' },
    { year: 2004, month: 7, rate: 0.5, monthName: 'Jul' },
    { year: 2004, month: 8, rate: 0.3, monthName: 'Ago' },
    { year: 2004, month: 9, rate: 0.6, monthName: 'Sep' },
    { year: 2004, month: 10, rate: 0.4, monthName: 'Oct' },
    { year: 2004, month: 11, rate: 0, monthName: 'Nov' },
    { year: 2004, month: 12, rate: 0.8, monthName: 'Dic' },
    // 2005
    { year: 2005, month: 1, rate: 1.5, monthName: 'Ene' },
    { year: 2005, month: 2, rate: 0.9, monthName: 'Feb' },
    { year: 2005, month: 3, rate: 1.5, monthName: 'Mar' },
    { year: 2005, month: 4, rate: 0.5, monthName: 'Abr' },
    { year: 2005, month: 5, rate: 0.6, monthName: 'May' },
    { year: 2005, month: 6, rate: 0.9, monthName: 'Jun' },
    { year: 2005, month: 7, rate: 1, monthName: 'Jul' },
    { year: 2005, month: 8, rate: 0.4, monthName: 'Ago' },
    { year: 2005, month: 9, rate: 1.2, monthName: 'Sep' },
    { year: 2005, month: 10, rate: 0.8, monthName: 'Oct' },
    { year: 2005, month: 11, rate: 1.2, monthName: 'Nov' },
    { year: 2005, month: 12, rate: 1.1, monthName: 'Dic' },
    // 2006
    { year: 2006, month: 1, rate: 1.3, monthName: 'Ene' },
    { year: 2006, month: 2, rate: 0.4, monthName: 'Feb' },
    { year: 2006, month: 3, rate: 1.2, monthName: 'Mar' },
    { year: 2006, month: 4, rate: 1, monthName: 'Abr' },
    { year: 2006, month: 5, rate: 0.5, monthName: 'May' },
    { year: 2006, month: 6, rate: 0.5, monthName: 'Jun' },
    { year: 2006, month: 7, rate: 0.6, monthName: 'Jul' },
    { year: 2006, month: 8, rate: 0.6, monthName: 'Ago' },
    { year: 2006, month: 9, rate: 0.9, monthName: 'Sep' },
    { year: 2006, month: 10, rate: 0.9, monthName: 'Oct' },
    { year: 2006, month: 11, rate: 0.7, monthName: 'Nov' },
    { year: 2006, month: 12, rate: 1, monthName: 'Dic' },
    // 2007
    { year: 2007, month: 1, rate: 1.1, monthName: 'Ene' },
    { year: 2007, month: 2, rate: 0.3, monthName: 'Feb' },
    { year: 2007, month: 3, rate: 0.8, monthName: 'Mar' },
    { year: 2007, month: 4, rate: 0.7, monthName: 'Abr' },
    { year: 2007, month: 5, rate: 0.4, monthName: 'May' },
    { year: 2007, month: 6, rate: 0.4, monthName: 'Jun' },
    { year: 2007, month: 7, rate: 0.5, monthName: 'Jul' },
    { year: 2007, month: 8, rate: 0.6, monthName: 'Ago' },
    { year: 2007, month: 9, rate: 0.8, monthName: 'Sep' },
    { year: 2007, month: 10, rate: 0.7, monthName: 'Oct' },
    { year: 2007, month: 11, rate: 0.9, monthName: 'Nov' },
    { year: 2007, month: 12, rate: 0.9, monthName: 'Dic' },
    // 2008
    { year: 2008, month: 1, rate: 0.9, monthName: 'Ene' },
    { year: 2008, month: 2, rate: 0.5, monthName: 'Feb' },
    { year: 2008, month: 3, rate: 1.1, monthName: 'Mar' },
    { year: 2008, month: 4, rate: 0.8, monthName: 'Abr' },
    { year: 2008, month: 5, rate: 0.6, monthName: 'May' },
    { year: 2008, month: 6, rate: 0.6, monthName: 'Jun' },
    { year: 2008, month: 7, rate: 0.4, monthName: 'Jul' },
    { year: 2008, month: 8, rate: 0.5, monthName: 'Ago' },
    { year: 2008, month: 9, rate: 0.5, monthName: 'Sep' },
    { year: 2008, month: 10, rate: 0.4, monthName: 'Oct' },
    { year: 2008, month: 11, rate: 0.3, monthName: 'Nov' },
    { year: 2008, month: 12, rate: 0.3, monthName: 'Dic' },
    // 2009
    { year: 2009, month: 1, rate: 0.5, monthName: 'Ene' },
    { year: 2009, month: 2, rate: 0.4, monthName: 'Feb' },
    { year: 2009, month: 3, rate: 0.6, monthName: 'Mar' },
    { year: 2009, month: 4, rate: 0.3, monthName: 'Abr' },
    { year: 2009, month: 5, rate: 0.3, monthName: 'May' },
    { year: 2009, month: 6, rate: 0.4, monthName: 'Jun' },
    { year: 2009, month: 7, rate: 0.6, monthName: 'Jul' },
    { year: 2009, month: 8, rate: 0.8, monthName: 'Ago' },
    { year: 2009, month: 9, rate: 0.7, monthName: 'Sep' },
    { year: 2009, month: 10, rate: 0.8, monthName: 'Oct' },
    { year: 2009, month: 11, rate: 0.8, monthName: 'Nov' },
    { year: 2009, month: 12, rate: 0.9, monthName: 'Dic' },
    // 2010
    { year: 2010, month: 1, rate: 1, monthName: 'Ene' },
    { year: 2010, month: 2, rate: 1.2, monthName: 'Feb' },
    { year: 2010, month: 3, rate: 1.1, monthName: 'Mar' },
    { year: 2010, month: 4, rate: 0.8, monthName: 'Abr' },
    { year: 2010, month: 5, rate: 0.7, monthName: 'May' },
    { year: 2010, month: 6, rate: 0.7, monthName: 'Jun' },
    { year: 2010, month: 7, rate: 0.8, monthName: 'Jul' },
    { year: 2010, month: 8, rate: 0.7, monthName: 'Ago' },
    { year: 2010, month: 9, rate: 0.7, monthName: 'Sep' },
    { year: 2010, month: 10, rate: 0.8, monthName: 'Oct' },
    { year: 2010, month: 11, rate: 0.7, monthName: 'Nov' },
    { year: 2010, month: 12, rate: 0.8, monthName: 'Dic' },
    // 2011
    { year: 2011, month: 1, rate: 0.7, monthName: 'Ene' },
    { year: 2011, month: 2, rate: 0.7, monthName: 'Feb' },
    { year: 2011, month: 3, rate: 0.8, monthName: 'Mar' },
    { year: 2011, month: 4, rate: 0.8, monthName: 'Abr' },
    { year: 2011, month: 5, rate: 0.7, monthName: 'May' },
    { year: 2011, month: 6, rate: 0.7, monthName: 'Jun' },
    { year: 2011, month: 7, rate: 0.8, monthName: 'Jul' },
    { year: 2011, month: 8, rate: 0.8, monthName: 'Ago' },
    { year: 2011, month: 9, rate: 0.8, monthName: 'Sep' },
    { year: 2011, month: 10, rate: 0.6, monthName: 'Oct' },
    { year: 2011, month: 11, rate: 0.6, monthName: 'Nov' },
    { year: 2011, month: 12, rate: 0.8, monthName: 'Dic' },
    // 2012
    { year: 2012, month: 1, rate: 0.9, monthName: 'Ene' },
    { year: 2012, month: 2, rate: 0.7, monthName: 'Feb' },
    { year: 2012, month: 3, rate: 0.9, monthName: 'Mar' },
    { year: 2012, month: 4, rate: 0.8, monthName: 'Abr' },
    { year: 2012, month: 5, rate: 0.8, monthName: 'May' },
    { year: 2012, month: 6, rate: 0.7, monthName: 'Jun' },
    { year: 2012, month: 7, rate: 0.8, monthName: 'Jul' },
    { year: 2012, month: 8, rate: 0.9, monthName: 'Ago' },
    { year: 2012, month: 9, rate: 0.9, monthName: 'Sep' },
    { year: 2012, month: 10, rate: 0.8, monthName: 'Oct' },
    { year: 2012, month: 11, rate: 0.9, monthName: 'Nov' },
    { year: 2012, month: 12, rate: 1, monthName: 'Dic' },
    // 2013 (IPC Congreso/CABA alternativo)
    { year: 2013, month: 1, rate: 2.61, monthName: 'Ene' },
    { year: 2013, month: 2, rate: 1.14, monthName: 'Feb' },
    { year: 2013, month: 3, rate: 1.50, monthName: 'Mar' },
    { year: 2013, month: 4, rate: 1.43, monthName: 'Abr' },
    { year: 2013, month: 5, rate: 1.63, monthName: 'May' },
    { year: 2013, month: 6, rate: 2.19, monthName: 'Jun' },
    { year: 2013, month: 7, rate: 2.63, monthName: 'Jul' },
    { year: 2013, month: 8, rate: 2.14, monthName: 'Ago' },
    { year: 2013, month: 9, rate: 2.12, monthName: 'Sep' },
    { year: 2013, month: 10, rate: 2.11, monthName: 'Oct' },
    { year: 2013, month: 11, rate: 2.38, monthName: 'Nov' },
    { year: 2013, month: 12, rate: 3.30, monthName: 'Dic' },
    // 2014 (IPC Congreso/CABA alternativo)
    { year: 2014, month: 1, rate: 4.62, monthName: 'Ene' },
    { year: 2014, month: 2, rate: 4.31, monthName: 'Feb' },
    { year: 2014, month: 3, rate: 3.42, monthName: 'Mar' },
    { year: 2014, month: 4, rate: 2.59, monthName: 'Abr' },
    { year: 2014, month: 5, rate: 2.28, monthName: 'May' },
    { year: 2014, month: 6, rate: 2.20, monthName: 'Jun' },
    { year: 2014, month: 7, rate: 2.47, monthName: 'Jul' },
    { year: 2014, month: 8, rate: 2.65, monthName: 'Ago' },
    { year: 2014, month: 9, rate: 2.48, monthName: 'Sep' },
    { year: 2014, month: 10, rate: 2.25, monthName: 'Oct' },
    { year: 2014, month: 11, rate: 1.86, monthName: 'Nov' },
    { year: 2014, month: 12, rate: 1.87, monthName: 'Dic' },
    // 2015 (IPC Congreso/CABA alternativo)
    { year: 2015, month: 1, rate: 2.08, monthName: 'Ene' },
    { year: 2015, month: 2, rate: 1.48, monthName: 'Feb' },
    { year: 2015, month: 3, rate: 2.12, monthName: 'Mar' },
    { year: 2015, month: 4, rate: 2.01, monthName: 'Abr' },
    { year: 2015, month: 5, rate: 2.00, monthName: 'May' },
    { year: 2015, month: 6, rate: 1.53, monthName: 'Jun' },
    { year: 2015, month: 7, rate: 1.92, monthName: 'Jul' },
    { year: 2015, month: 8, rate: 2.17, monthName: 'Ago' },
    { year: 2015, month: 9, rate: 1.92, monthName: 'Sep' },
    { year: 2015, month: 10, rate: 1.52, monthName: 'Oct' },
    { year: 2015, month: 11, rate: 2.20, monthName: 'Nov' },
    { year: 2015, month: 12, rate: 3.80, monthName: 'Dic' },
    // 2016 (IPC Congreso/CABA alternativo)
    { year: 2016, month: 1, rate: 3.60, monthName: 'Ene' },
    { year: 2016, month: 2, rate: 4.80, monthName: 'Feb' },
    { year: 2016, month: 3, rate: 3.20, monthName: 'Mar' },
    { year: 2016, month: 4, rate: 6.70, monthName: 'Abr' },
    { year: 2016, month: 5, rate: 3.50, monthName: 'May' },
    { year: 2016, month: 6, rate: 2.90, monthName: 'Jun' },
    { year: 2016, month: 7, rate: 2.40, monthName: 'Jul' },
    { year: 2016, month: 8, rate: 0.50, monthName: 'Ago' },
    { year: 2016, month: 9, rate: 0.80, monthName: 'Sep' },
    { year: 2016, month: 10, rate: 2.90, monthName: 'Oct' },
    { year: 2016, month: 11, rate: 1.90, monthName: 'Nov' },
    { year: 2016, month: 12, rate: 1.60, monthName: 'Dic' },
    // 2017
    { year: 2017, month: 1, rate: 1.59, monthName: 'Ene' },
    { year: 2017, month: 2, rate: 2.07, monthName: 'Feb' },
    { year: 2017, month: 3, rate: 2.37, monthName: 'Mar' },
    { year: 2017, month: 4, rate: 2.66, monthName: 'Abr' },
    { year: 2017, month: 5, rate: 1.43, monthName: 'May' },
    { year: 2017, month: 6, rate: 1.19, monthName: 'Jun' },
    { year: 2017, month: 7, rate: 1.73, monthName: 'Jul' },
    { year: 2017, month: 8, rate: 1.40, monthName: 'Ago' },
    { year: 2017, month: 9, rate: 1.90, monthName: 'Sep' },
    { year: 2017, month: 10, rate: 1.51, monthName: 'Oct' },
    { year: 2017, month: 11, rate: 1.38, monthName: 'Nov' },
    { year: 2017, month: 12, rate: 3.14, monthName: 'Dic' },
    // 2018
    { year: 2018, month: 1, rate: 1.76, monthName: 'Ene' },
    { year: 2018, month: 2, rate: 2.42, monthName: 'Feb' },
    { year: 2018, month: 3, rate: 2.34, monthName: 'Mar' },
    { year: 2018, month: 4, rate: 2.74, monthName: 'Abr' },
    { year: 2018, month: 5, rate: 2.08, monthName: 'May' },
    { year: 2018, month: 6, rate: 3.74, monthName: 'Jun' },
    { year: 2018, month: 7, rate: 3.10, monthName: 'Jul' },
    { year: 2018, month: 8, rate: 3.89, monthName: 'Ago' },
    { year: 2018, month: 9, rate: 6.53, monthName: 'Sep' },
    { year: 2018, month: 10, rate: 5.39, monthName: 'Oct' },
    { year: 2018, month: 11, rate: 3.15, monthName: 'Nov' },
    { year: 2018, month: 12, rate: 2.57, monthName: 'Dic' },
    // 2019
    { year: 2019, month: 1, rate: 2.91, monthName: 'Ene' },
    { year: 2019, month: 2, rate: 3.77, monthName: 'Feb' },
    { year: 2019, month: 3, rate: 4.68, monthName: 'Mar' },
    { year: 2019, month: 4, rate: 3.44, monthName: 'Abr' },
    { year: 2019, month: 5, rate: 3.06, monthName: 'May' },
    { year: 2019, month: 6, rate: 2.72, monthName: 'Jun' },
    { year: 2019, month: 7, rate: 2.20, monthName: 'Jul' },
    { year: 2019, month: 8, rate: 3.95, monthName: 'Ago' },
    { year: 2019, month: 9, rate: 5.89, monthName: 'Sep' },
    { year: 2019, month: 10, rate: 3.29, monthName: 'Oct' },
    { year: 2019, month: 11, rate: 4.25, monthName: 'Nov' },
    { year: 2019, month: 12, rate: 3.74, monthName: 'Dic' },
    // 2020
    { year: 2020, month: 1, rate: 2.25, monthName: 'Ene' },
    { year: 2020, month: 2, rate: 2.01, monthName: 'Feb' },
    { year: 2020, month: 3, rate: 3.34, monthName: 'Mar' },
    { year: 2020, month: 4, rate: 1.50, monthName: 'Abr' },
    { year: 2020, month: 5, rate: 1.54, monthName: 'May' },
    { year: 2020, month: 6, rate: 2.24, monthName: 'Jun' },
    { year: 2020, month: 7, rate: 1.93, monthName: 'Jul' },
    { year: 2020, month: 8, rate: 2.70, monthName: 'Ago' },
    { year: 2020, month: 9, rate: 2.84, monthName: 'Sep' },
    { year: 2020, month: 10, rate: 3.76, monthName: 'Oct' },
    { year: 2020, month: 11, rate: 3.16, monthName: 'Nov' },
    { year: 2020, month: 12, rate: 4.01, monthName: 'Dic' },
    // 2021
    { year: 2021, month: 1, rate: 4.04, monthName: 'Ene' },
    { year: 2021, month: 2, rate: 3.57, monthName: 'Feb' },
    { year: 2021, month: 3, rate: 4.81, monthName: 'Mar' },
    { year: 2021, month: 4, rate: 4.08, monthName: 'Abr' },
    { year: 2021, month: 5, rate: 3.32, monthName: 'May' },
    { year: 2021, month: 6, rate: 3.17, monthName: 'Jun' },
    { year: 2021, month: 7, rate: 3.00, monthName: 'Jul' },
    { year: 2021, month: 8, rate: 2.47, monthName: 'Ago' },
    { year: 2021, month: 9, rate: 3.55, monthName: 'Sep' },
    { year: 2021, month: 10, rate: 3.52, monthName: 'Oct' },
    { year: 2021, month: 11, rate: 2.53, monthName: 'Nov' },
    { year: 2021, month: 12, rate: 3.84, monthName: 'Dic' },
    // 2022
    { year: 2022, month: 1, rate: 3.88, monthName: 'Ene' },
    { year: 2022, month: 2, rate: 4.69, monthName: 'Feb' },
    { year: 2022, month: 3, rate: 6.73, monthName: 'Mar' },
    { year: 2022, month: 4, rate: 6.05, monthName: 'Abr' },
    { year: 2022, month: 5, rate: 5.05, monthName: 'May' },
    { year: 2022, month: 6, rate: 5.30, monthName: 'Jun' },
    { year: 2022, month: 7, rate: 7.41, monthName: 'Jul' },
    { year: 2022, month: 8, rate: 6.97, monthName: 'Ago' },
    { year: 2022, month: 9, rate: 6.17, monthName: 'Sep' },
    { year: 2022, month: 10, rate: 6.35, monthName: 'Oct' },
    { year: 2022, month: 11, rate: 4.92, monthName: 'Nov' },
    { year: 2022, month: 12, rate: 5.12, monthName: 'Dic' },
    // 2023
    { year: 2023, month: 1, rate: 6.03, monthName: 'Ene' },
    { year: 2023, month: 2, rate: 6.63, monthName: 'Feb' },
    { year: 2023, month: 3, rate: 7.68, monthName: 'Mar' },
    { year: 2023, month: 4, rate: 8.40, monthName: 'Abr' },
    { year: 2023, month: 5, rate: 7.77, monthName: 'May' },
    { year: 2023, month: 6, rate: 5.95, monthName: 'Jun' },
    { year: 2023, month: 7, rate: 6.34, monthName: 'Jul' },
    { year: 2023, month: 8, rate: 12.44, monthName: 'Ago' },
    { year: 2023, month: 9, rate: 12.75, monthName: 'Sep' },
    { year: 2023, month: 10, rate: 8.30, monthName: 'Oct' },
    { year: 2023, month: 11, rate: 12.81, monthName: 'Nov' },
    { year: 2023, month: 12, rate: 25.47, monthName: 'Dic' },
    // 2024
    { year: 2024, month: 1, rate: 20.61, monthName: 'Ene' },
    { year: 2024, month: 2, rate: 13.24, monthName: 'Feb' },
    { year: 2024, month: 3, rate: 11.01, monthName: 'Mar' },
    { year: 2024, month: 4, rate: 8.83, monthName: 'Abr' },
    { year: 2024, month: 5, rate: 4.18, monthName: 'May' },
    { year: 2024, month: 6, rate: 4.58, monthName: 'Jun' },
    { year: 2024, month: 7, rate: 4.03, monthName: 'Jul' },
    { year: 2024, month: 8, rate: 4.17, monthName: 'Ago' },
    { year: 2024, month: 9, rate: 3.47, monthName: 'Sep' },
    { year: 2024, month: 10, rate: 2.69, monthName: 'Oct' },
    { year: 2024, month: 11, rate: 2.43, monthName: 'Nov' },
    { year: 2024, month: 12, rate: 2.70, monthName: 'Dic' },
    // 2025
    { year: 2025, month: 1, rate: 2.21, monthName: 'Ene' },
    { year: 2025, month: 2, rate: 2.40, monthName: 'Feb' },
    { year: 2025, month: 3, rate: 3.73, monthName: 'Mar' },
    { year: 2025, month: 4, rate: 2.78, monthName: 'Abr' },
    { year: 2025, month: 5, rate: 1.50, monthName: 'May' },
    { year: 2025, month: 6, rate: 1.62, monthName: 'Jun' },
    { year: 2025, month: 7, rate: 1.90, monthName: 'Jul' },
    { year: 2025, month: 8, rate: 1.88, monthName: 'Ago' },
    { year: 2025, month: 9, rate: 2.08, monthName: 'Sep' },
    { year: 2025, month: 10, rate: 2.34, monthName: 'Oct' },
    { year: 2025, month: 11, rate: 2.47, monthName: 'Nov' },
    { year: 2025, month: 12, rate: 2.85, monthName: 'Dic' },
    // 2026
    { year: 2026, month: 1, rate: 2.90, monthName: 'Ene' },
    { year: 2026, month: 2, rate: 2.90, monthName: 'Feb' },
    { year: 2026, month: 3, rate: 3.40, monthName: 'Mar' },
    { year: 2026, month: 4, rate: 2.60, monthName: 'Abr' },
    { year: 2026, month: 5, rate: 2.10, monthName: 'May' }
  ], []);

  // Compute cumulative indexes on the fly
  const compoundedIpcList = useMemo(() => {
    const list = [];
    let currentIdx = 100.0;
    for (let i = 0; i < monthlyRates.length; i++) {
      const item = monthlyRates[i];
      currentIdx = currentIdx * (1 + item.rate / 100);
      list.push({
        ...item,
        indexValue: currentIdx,
        label: `${item.monthName} ${item.year}`
      });
    }
    return list;
  }, [monthlyRates]);

  // States
  const [amount, setAmount] = useState(() => {
    const q = queryParams.get('amt');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_ia_amount');
    return saved !== null && saved !== 'undefined' ? saved : '100000';
  });

  const [startIndex, setStartIndex] = useState(() => {
    const q = queryParams.get('start');
    if (q !== null && !isNaN(q)) {
      const idx = Number(q);
      if (idx >= 0 && idx < compoundedIpcList.length) return idx;
    }
    const saved = localStorage.getItem('valia_ia_startIndex');
    if (saved !== null && saved !== 'undefined') {
      const idx = Number(saved);
      if (idx >= 0 && idx < compoundedIpcList.length) return idx;
    }
    return 0; // Ene 2017
  });

  const [endIndex, setEndIndex] = useState(() => {
    const q = queryParams.get('end');
    if (q !== null && !isNaN(q)) {
      const idx = Number(q);
      if (idx >= 0 && idx < compoundedIpcList.length) return idx;
    }
    const saved = localStorage.getItem('valia_ia_endIndex');
    if (saved !== null && saved !== 'undefined') {
      const idx = Number(saved);
      if (idx >= 0 && idx < compoundedIpcList.length) return idx;
    }
    return compoundedIpcList.length - 1; // Last available month
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Clamp values if start is after end
  useEffect(() => {
    if (startIndex > endIndex) {
      setEndIndex(startIndex);
    }
  }, [startIndex, endIndex]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('valia_ia_amount', amount);
    localStorage.setItem('valia_ia_startIndex', String(startIndex));
    localStorage.setItem('valia_ia_endIndex', String(endIndex));
  }, [amount, startIndex, endIndex]);

  // Calculations
  const results = useMemo(() => {
    if (startIndex > endIndex || startIndex < 0 || endIndex >= compoundedIpcList.length) return null;

    const startObj = compoundedIpcList[startIndex];
    const endObj = compoundedIpcList[endIndex];
    const initialAmount = Number(amount) || 0;

    // Index factor ratio
    // Note: We use the index at the END of the start month to the end of the end month.
    // If they are equal, it represents 0 inflation.
    const startVal = startObj.indexValue;
    const endVal = endObj.indexValue;
    const factor = endVal / startVal;

    const updatedValue = initialAmount * factor;
    const accumulatedInflation = (factor - 1) * 100;
    const powerLoss = (1 - 1 / factor) * 100;

    // Simulation series: how the purchasing power of the original amount decayed over time
    const chartData = [];
    const monthlyBreakdown = [];

    let tempCumulativeFactor = 1.0;
    const baseVal = compoundedIpcList[startIndex].indexValue;

    for (let i = startIndex; i <= endIndex; i++) {
      const currentObj = compoundedIpcList[i];
      const stepFactor = currentObj.indexValue / baseVal;
      
      // Equivalent purchasing power of original cash
      const currentPurchasingPower = initialAmount / stepFactor;
      const stepInflationAcum = (stepFactor - 1) * 100;

      chartData.push({
        label: currentObj.label,
        'Poder Adquisitivo Real': Math.round(currentPurchasingPower),
        'Inflación Acumulada': stepInflationAcum
      });

      monthlyBreakdown.push({
        label: currentObj.label,
        monthlyRate: currentObj.rate,
        indexValue: currentObj.indexValue,
        cumInflation: stepInflationAcum,
        adjustedValue: Math.round(initialAmount * stepFactor)
      });
    }

    return {
      updatedValue: Math.round(updatedValue),
      accumulatedInflation,
      powerLoss,
      chartData,
      monthlyBreakdown,
      startLabel: startObj.label,
      endLabel: endObj.label
    };
  }, [amount, startIndex, endIndex, compoundedIpcList]);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('seccion', 'herramientas');
    params.set('herramienta', 'actualizador-ipc');
    if (amount) params.set('amt', amount);
    params.set('start', String(startIndex));
    params.set('end', String(endIndex));

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  const exportToCSV = () => {
    if (!results) return;
    const headers = ['Mes', 'Inflación Mensual (%)', 'Inflación Acumulada (%)', 'Monto Actualizado Equivalente ($)'];
    const rows = results.monthlyBreakdown.map(row => [
      row.label,
      row.monthlyRate,
      row.cumInflation.toFixed(2),
      row.adjustedValue
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `valia_actualizador_ipc_${results.startLabel}_a_${results.endLabel}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "¿De dónde provienen las tasas de inflación?",
      a: "Toda la serie mensual histórica de inflación proviene de las publicaciones oficiales del Índice de Precios al Consumidor (IPC) nacional de cobertura nacional elaborado por el INDEC de la República Argentina."
    },
    {
      q: "¿Cómo se calcula el ajuste monetario por IPC?",
      a: "Para actualizar un monto de un mes 'A' a un mes 'B', se divide el valor del índice de precios del mes 'B' por el valor del índice del mes 'A'. Luego, se multiplica el monto original por ese factor resultante."
    },
    {
      q: "¿Cómo se calcula la pérdida del poder adquisitivo?",
      a: "La pérdida de poder adquisitivo refleja cuánto menos compra el mismo billete nominal al cabo de un período. Se calcula como `1 - (1 / Factor de Inflación)`. Por ejemplo, si hay una inflación acumulada del 100% (factor = 2.0), el poder adquisitivo se reduce un 50%: ahora podés comprar exactamente la mitad de los bienes que antes."
    },
    {
      q: "¿Sirve este índice para contratos de alquiler (ICL / Casa Propia)?",
      a: "Esta calculadora utiliza la variación directa del IPC del INDEC, que es el índice de inflación general. Para contratos comerciales o de servicios profesionales, es la métrica de actualización estándar. Para contratos residenciales que requieran índices regulados como el ICL (Índice de Contratos de Locación), el cálculo combina inflación y salarios promedio (RIPTE)."
    }
  ];

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Calendar size={32} style={{ color: '#06B6D4' }} />
          Actualizador por IPC INDEC
        </h1>
        <p>Ajuste de pesos históricos por inflación oficial en Argentina (2003 - 2026).</p>
        
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="help-btn"
        >
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo se mide la inflación y el poder de compra?
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Inputs Panel */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
            Parámetros de Ajuste
          </h2>

          <FinancialInput label="Monto Original ($)" value={amount} onChange={setAmount} prefix="$" step={10000} />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Mes de Inicio
              </label>
              <select 
                value={startIndex} 
                onChange={e => setStartIndex(Number(e.target.value))}
                className="input-field"
                style={{ width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              >
                {compoundedIpcList.map((item, idx) => (
                  <option key={idx} value={idx}>{item.label}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Mes de Fin
              </label>
              <select 
                value={endIndex} 
                onChange={e => setEndIndex(Number(e.target.value))}
                className="input-field"
                style={{ width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
              >
                {compoundedIpcList.map((item, idx) => (
                  <option key={idx} value={idx} disabled={idx < startIndex}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div 
            onClick={() => navigateToArticle('actualizacion-ipc-contratos-deudas')}
            className="card no-print"
            style={{ 
              marginTop: '1.5rem', 
              cursor: 'pointer',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: 'var(--border-radius-md)',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <BookOpen size={18} className="text-accent-primary" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem', textAlign: 'left' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.15rem', fontSize: '0.725rem', fontWeight: 600, textTransform: 'uppercase' }}>Guía Recomendada</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Actualización por IPC: Guía para indexar deudas y contratos</span>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {results && (
            <>
              {/* Print-only Header */}
              <PrintReportHeader 
                title="Reporte de Actualización por IPC INDEC"
                subtitle="Ficha de Ajuste por Coeficientes de Inflación Acumulada"
                params={[
                  { label: 'Monto Original', value: formatCurrencyFull(Number(amount) || 0) },
                  { label: 'Período Inicial', value: results.startLabel },
                  { label: 'Período Final', value: results.endLabel },
                  { label: 'Inflación del Periodo', value: formatPercent(results.accumulatedInflation) }
                ]}
              />

              {/* Updated Amount Highlight Card */}
              <div className="card" style={{
                textAlign: 'center',
                borderTop: '4px solid var(--accent-primary)',
                background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08), transparent)'
              }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Monto Equivalente Actualizado (Poder de Compra)
                </p>
                <h3 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1, margin: '0.25rem 0' }}>
                  {formatCurrencyFull(results.updatedValue)}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                  Para comprar hoy lo mismo que comprabas con <strong>{formatCurrencyFull(Number(amount) || 0)}</strong> en {results.startLabel}, necesitás ese monto.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '2px solid #F59E0B' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Inflación Acumulada</span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{formatPercent(results.accumulatedInflation)}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Aumento general de precios</span>
                </div>

                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '2px solid #EF4444' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pérdida Poder Adquisitivo</span>
                  <strong style={{ fontSize: '1.25rem', color: '#EF4444' }}>-{formatPercent(results.powerLoss)}</strong>
                  <span style={{ fontSize: '0.7rem', color: '#EF4444' }}>Depreciación real de la moneda</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '-0.5rem' }}>
                <button 
                  onClick={() => {
                    handleShare()
                      .then(() => {
                        setShareCopied(true);
                        setTimeout(() => setShareCopied(false), 2000);
                      })
                      .catch(err => console.error(err));
                  }}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Share2 size={16} />
                  {shareCopied ? '¡Copiado!' : 'Compartir Simulación'}
                </button>
                
                <button 
                  onClick={exportToCSV}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Download size={16} />
                  Exportar CSV (Excel)
                </button>

                <button 
                  onClick={() => window.print()}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Printer size={16} />
                  Imprimir Reporte PDF
                </button>
              </div>

              {/* Chart */}
              <div className="card chart-container" id="ipc-chart" style={{ height: '360px' }}>
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1rem', fontWeight: 600 }}>
                  Erosión del Valor de la Moneda
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Cómo disminuye el poder adquisitivo real de un monto fijo nominal de {formatCurrencyFull(Number(amount) || 0)}
                </p>
                <ResponsiveContainer width="100%" height="75%">
                  <AreaChart data={results.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="label" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                    <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} tickFormatter={formatCurrencyFull} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '15px', fontSize: 12 }} />
                    
                    <Area type="monotone" dataKey="Poder Adquisitivo Real" stroke="#EF4444" fillOpacity={1} fill="url(#colorPower)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Table Toggle */}
              <button className="btn btn-outline" onClick={() => setShowTable(!showTable)} style={{ alignSelf: 'flex-start' }}>
                <TableProperties size={18} />
                {showTable ? 'Ocultar Tabla' : 'Mostrar Desglose Mensual'}
              </button>

              {showTable && (
                <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>Periodo</th>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>Inflación Mes</th>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>Inflación Acum.</th>
                        <th style={{ padding: '1rem' }}>Monto Reexpresado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.monthlyBreakdown.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{row.label}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 'bold' }}>{row.monthlyRate.toFixed(2)}%</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{row.cumInflation.toFixed(1)}%</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#06B6D4', fontWeight: 600 }}>{formatCurrencyFull(row.adjustedValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <AdvisorCTA goalContext="ahorro" />
              <PrintAdvisorCTA />
            </>
          )}
        </div>
      </div>

      {/* FAQs Section */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Preguntas Frecuentes sobre el Ajuste por IPC
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{ 
                borderBottom: '1px solid var(--border-color)', 
                paddingBottom: '0.75rem' 
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
              >
                <span>{faq.q}</span>
                <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                  {activeFaq === index ? '−' : '+'}
                </span>
              </button>
              {activeFaq === index && (
                <p 
                  className="animate-fade-in"
                  style={{ 
                    fontSize: '0.875rem', 
                    lineHeight: '1.6', 
                    color: 'var(--text-secondary)',
                    margin: '0.5rem 0 0 0',
                    paddingLeft: '0.25rem'
                  }}
                >
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Help Modal */}
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo se calcula el ajuste monetario?"
      >
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. Inflación y el IPC</h3>
        <p>
          El Índice de Precios al Consumidor (IPC) del INDEC mide la variación de los precios de una canasta de bienes y servicios representativa del consumo de los hogares en Argentina. Se publica mensualmente a mediados del mes posterior.
        </p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Reexpresión de Valores (Ajuste por Inflación)</h3>
        <p>
          Debido a la alta inflación histórica en pesos, un monto de dinero del pasado compra significativamente más que el mismo monto hoy. Reexpresar por inflación consiste en calcular cuántos pesos se necesitan en la actualidad para igualar el poder de compra de pesos del pasado.
        </p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Coeficiente CER e Indexación</h3>
        <p>
          El Coeficiente de Estabilización de Referencia (CER) es una tasa diaria calculada por el BCRA que refleja la inflación minorista (IPC). Se utiliza para indexar depósitos de Plazo Fijo UVA, créditos hipotecarios UVA y ciertos bonos públicos soberanos en pesos.
        </p>
      </HelpModal>
    </div>
  );
};

export default IpcActualizerCalculator;
