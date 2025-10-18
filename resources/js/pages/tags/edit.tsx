import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Tag } from '@/types/contact';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, Tag as TagIcon } from 'lucide-react';
import { FormEvent, useState } from 'react';

const PRESET_COLORS = [
    '#10B981',
    '#3B82F6',
    '#F59E0B',
    '#8B5CF6',
    '#EF4444',
    '#06B6D4',
    '#EC4899',
    '#84CC16',
];

interface TagEditProps {
    tag: Tag;
}

export default function TagEdit({ tag }: TagEditProps) {
    const [selectedColor, setSelectedColor] = useState(tag.color);

    const { data, setData, put, processing, errors } = useForm({
        name: tag.name || '',
        color: tag.color || PRESET_COLORS[0],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/tags/${tag.id}`);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    return (
        <AppLayout>
            <Head title={`Chỉnh sửa - ${tag.name}`} />

            <div className="mx-auto max-w-2xl space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Chỉnh sửa nhãn
                    </h1>
                    <p className="text-muted-foreground">
                        Cập nhật thông tin cho {tag.name}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin nhãn</CardTitle>
                            <CardDescription>
                                Cập nhật tên và màu cho nhãn
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Tên nhãn{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Quan trọng, VIP, Đối tác..."
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                                {data.name && (
                                    <p className="text-xs text-muted-foreground">
                                        Slug: {generateSlug(data.name)}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Màu sắc{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <div className="flex flex-wrap gap-3">
                                    {PRESET_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => {
                                                setSelectedColor(color);
                                                setData('color', color);
                                            }}
                                            className={`h-12 w-12 rounded-lg transition-all ${
                                                data.color === color
                                                    ? 'ring-2 ring-offset-2'
                                                    : 'opacity-60 hover:opacity-100'
                                            }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Label htmlFor="custom-color">
                                        Hoặc chọn màu tùy chỉnh:
                                    </Label>
                                    <input
                                        id="custom-color"
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => {
                                            setSelectedColor(e.target.value);
                                            setData('color', e.target.value);
                                        }}
                                        className="h-10 w-20 cursor-pointer rounded border"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        {data.color}
                                    </span>
                                </div>
                                {errors.color && (
                                    <p className="text-sm text-destructive">
                                        {errors.color}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Xem trước</Label>
                                <div className="flex items-center gap-3 rounded-lg border p-4">
                                    <div
                                        className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium text-white"
                                        style={{ backgroundColor: data.color }}
                                    >
                                        <TagIcon className="h-3 w-3" />
                                        {data.name || 'Tên nhãn'}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={`/tags/${tag.id}`}>Hủy</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Đang cập nhật...' : 'Cập nhật'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
