
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Plus, Minus, X, Divide, Sparkles, Sigma, Percent, FunctionSquare, SquareRadical, Braces, Square, RectangleHorizontal, Triangle, Circle, Combine, Milestone, Anchor, Key, BarChart, BetweenHorizontalStart, Pilcrow, UnfoldVertical, PercentCircle, Banknote, UtilityPole, Timer, Puzzle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { MathCategory } from '@/lib/types';
import { useRouter } from 'next/navigation';
import React from 'react';

const categoryGroups: Record<string, MathCategory[]> = {
    'Arithmetic': ['addition', 'subtraction', 'multiplication', 'division', 'mixed'],
    'Advanced Arithmetic': ['fractions', 'decimals', 'percentages', 'ratios', 'exponents', 'square-roots', 'order-of-operations'],
    'Algebra': ['algebra', 'linear-equations', 'quadratic-equations'],
    'Geometry': ['area-of-squares', 'area-of-rectangles', 'area-of-triangles', 'circumference', 'pythagorean-theorem'],
    'Number Theory': ['prime-numbers', 'factors', 'multiples', 'roman-numerals'],
    'Statistics & Probability': ['mean', 'median', 'mode', 'range', 'simple-probability'],
    'Practical Math': ['simple-interest', 'discounts', 'unit-conversion', 'time-calculation'],
    'Logic': ['logic-puzzles']
};

const categoryIcons: Record<MathCategory, React.ReactNode> = {
  addition: <Plus />, subtraction: <Minus />, multiplication: <X />, division: <Divide />, mixed: <Sparkles />,
  algebra: <Sigma />, percentages: <Percent />, exponents: <FunctionSquare />, fractions: <Sigma />, decimals: <Milestone />,
  ratios: <BetweenHorizontalStart />, 'square-roots': <SquareRadical />, 'order-of-operations': <Braces />,
  'area-of-squares': <Square />, 'area-of-rectangles': <RectangleHorizontal />, 'area-of-triangles': <Triangle />,
  circumference: <Circle />, 'pythagorean-theorem': <Combine />, 'linear-equations': <Milestone />,
  'quadratic-equations': <Sigma />, 'prime-numbers': <Anchor />, 'factors': <Key />, 'multiples': <Pilcrow />,
  'roman-numerals': <Milestone />, mean: <BarChart />, median: <UnfoldVertical />, mode: <BarChart />,
  range: <UnfoldVertical />, 'simple-probability': <PercentCircle />, 'simple-interest': <Banknote />,
  discounts: <Banknote />, 'unit-conversion': <UtilityPole />, 'time-calculation': <Timer />, 'logic-puzzles': <Puzzle />,
};


export default function CategoriesPage() {
    const router = useRouter();

    const handleCategorySelect = (category: MathCategory) => {
        router.push(`/app/challenge?category=${category}`);
    };
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

  return (
    <div className="flex flex-col gap-8">
        <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div>
                <h1 className="text-4xl font-bold tracking-tight">All Categories</h1>
                <p className="text-muted-foreground mt-1">Pick a challenge to test your skills.</p>
            </div>
            <Link href="/app/challenge">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            </Link>
        </motion.div>

        {Object.entries(categoryGroups).map(([groupName, categories]) => (
            <div key={groupName}>
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{groupName}</h2>
                <motion.div 
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {categories.map((cat) => (
                        <motion.div key={cat} variants={itemVariants}>
                            <Button
                                variant="outline"
                                className="w-full h-24 text-md flex-col gap-2 justify-center transition-all duration-300 transform hover:scale-105 hover:bg-primary/10 hover:border-primary"
                                onClick={() => handleCategorySelect(cat)}
                            >
                                <div className="h-8 w-8 text-primary">{categoryIcons[cat]}</div>
                                <span className="capitalize text-center">{cat.replace(/-/g, ' ')}</span>
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        ))}
    </div>
  );
}
