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
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { FormEvent, useState } from 'react';

const PRESET_COLORS = [
    '#10B981', // Green
    '#3B82F6', // Blue
    '#F59E0B', // Orange
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#EC4899', // Pink
    '#84CC16', // Lime
];

export default function GroupCreate() {
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        color: PRESET_COLORS[0],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/groups');
    };

    return (
        <AppLayout>
            <Head title="Thêm nhóm mới" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Thêm nhóm mới
                    </h1>
                    <p className="text-muted-foreground">
                        Tạo nhóm để tổ chức liên hệ
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin nhóm</CardTitle>
                            <CardDescription>
                                Nhập tên và chọn màu cho nhóm
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Tên nhóm{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Gia đình, Bạn bè, Công việc..."
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Mô tả ngắn về nhóm này..."
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Color Picker */}
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
                                            style={{
                                                backgroundColor: color,
                                                ringColor: color,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Custom Color Input */}
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

                            {/* Preview */}
                            <div className="space-y-2">
                                <Label>Xem trước</Label>
                                <div className="flex items-center gap-3 rounded-lg border p-4">
                                    <div
                                        className="h-10 w-10 rounded-lg"
                                        style={{ backgroundColor: data.color }}
                                    />
                                    <div>
                                        <p className="font-medium">
                                            {data.name || 'Tên nhóm'}
                                        </p>
                                        {data.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {data.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/groups">Hủy</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Đang lưu...' : 'Lưu nhóm'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
