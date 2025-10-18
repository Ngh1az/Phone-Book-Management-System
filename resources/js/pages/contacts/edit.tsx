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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Contact, Group, Tag } from '@/types/contact';
import { Head, Link, useForm } from '@inertiajs/react';
import { Save, Upload, X } from 'lucide-react';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';

interface ContactEditProps {
    contact: Contact;
    groups: Group[];
    tags: Tag[];
}

export default function ContactEdit({
    contact,
    groups,
    tags,
}: ContactEditProps) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        contact.avatar_url || null,
    );
    const [selectedTags, setSelectedTags] = useState<number[]>(
        contact.tags?.map((tag) => tag.id) || [],
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        phone_number: contact.phone_number || '',
        email: contact.email || '',
        company: contact.company || '',
        job_title: contact.job_title || '',
        address: contact.address || '',
        birthday: contact.birthday || '',
        notes: contact.notes || '',
        group_id: contact.group_id?.toString() || 'none',
        avatar: null as File | null,
        tags: contact.tags?.map((tag) => tag.id) || ([] as number[]),
        _method: 'PUT',
    });

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = () => {
        setData('avatar', null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const toggleTag = (tagId: number) => {
        const newTags = selectedTags.includes(tagId)
            ? selectedTags.filter((id) => id !== tagId)
            : [...selectedTags, tagId];
        setSelectedTags(newTags);
        setData('tags', newTags);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(`/contacts/${contact.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title={`Chỉnh sửa - ${contact.full_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Chỉnh sửa liên hệ
                        </h1>
                        <p className="text-muted-foreground">
                            Cập nhật thông tin cho {contact.full_name}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* Left Column - Avatar */}
                        <div className="md:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ảnh đại diện</CardTitle>
                                    <CardDescription>
                                        Tải lên ảnh đại diện cho liên hệ
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {avatarPreview ? (
                                        <div className="relative">
                                            <img
                                                src={avatarPreview}
                                                alt="Preview"
                                                className="h-48 w-full rounded-lg object-cover"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={removeAvatar}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:border-muted-foreground/50"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                        >
                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Nhấn để tải ảnh lên
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                    {errors.avatar && (
                                        <p className="text-sm text-destructive">
                                            {errors.avatar}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Group & Tags */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Phân loại</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Group */}
                                    <div className="space-y-2">
                                        <Label htmlFor="group_id">Nhóm</Label>
                                        <Select
                                            value={data.group_id || 'none'}
                                            onValueChange={(value) =>
                                                setData(
                                                    'group_id',
                                                    value === 'none'
                                                        ? ''
                                                        : value,
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn nhóm" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    Không có
                                                </SelectItem>
                                                {groups.map((group) => (
                                                    <SelectItem
                                                        key={group.id}
                                                        value={group.id.toString()}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="h-3 w-3 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        group.color,
                                                                }}
                                                            />
                                                            {group.name}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.group_id && (
                                            <p className="text-sm text-destructive">
                                                {errors.group_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    <div className="space-y-2">
                                        <Label>Nhãn</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag) => (
                                                <Button
                                                    key={tag.id}
                                                    type="button"
                                                    variant={
                                                        selectedTags.includes(
                                                            tag.id,
                                                        )
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        toggleTag(tag.id)
                                                    }
                                                    style={
                                                        selectedTags.includes(
                                                            tag.id,
                                                        )
                                                            ? {
                                                                  backgroundColor:
                                                                      tag.color,
                                                                  borderColor:
                                                                      tag.color,
                                                              }
                                                            : {
                                                                  borderColor:
                                                                      tag.color,
                                                                  color: tag.color,
                                                              }
                                                    }
                                                >
                                                    {tag.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Form Fields */}
                        <div className="space-y-6 md:col-span-2">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin cơ bản</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">
                                                Họ và tên đệm{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="first_name"
                                                value={data.first_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'first_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Nguyễn Văn"
                                            />
                                            {errors.first_name && (
                                                <p className="text-sm text-destructive">
                                                    {errors.first_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">
                                                Tên{' '}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="last_name"
                                                value={data.last_name}
                                                onChange={(e) =>
                                                    setData(
                                                        'last_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="An"
                                            />
                                            {errors.last_name && (
                                                <p className="text-sm text-destructive">
                                                    {errors.last_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone_number">
                                            Số điện thoại{' '}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="phone_number"
                                            value={data.phone_number}
                                            onChange={(e) =>
                                                setData(
                                                    'phone_number',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0912 345 678"
                                        />
                                        {errors.phone_number && (
                                            <p className="text-sm text-destructive">
                                                {errors.phone_number}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            placeholder="example@email.com"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="birthday">
                                            Ngày sinh
                                        </Label>
                                        <Input
                                            id="birthday"
                                            type="date"
                                            value={data.birthday}
                                            onChange={(e) =>
                                                setData(
                                                    'birthday',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.birthday && (
                                            <p className="text-sm text-destructive">
                                                {errors.birthday}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Work Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin công việc</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Công ty</Label>
                                        <Input
                                            id="company"
                                            value={data.company}
                                            onChange={(e) =>
                                                setData(
                                                    'company',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="FPT Software"
                                        />
                                        {errors.company && (
                                            <p className="text-sm text-destructive">
                                                {errors.company}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="job_title">
                                            Chức vụ
                                        </Label>
                                        <Input
                                            id="job_title"
                                            value={data.job_title}
                                            onChange={(e) =>
                                                setData(
                                                    'job_title',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Software Engineer"
                                        />
                                        {errors.job_title && (
                                            <p className="text-sm text-destructive">
                                                {errors.job_title}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Additional Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin thêm</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Địa chỉ</Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    'address',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="123 Trần Hưng Đạo, Q.1, TP.HCM"
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-destructive">
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Ghi chú</Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) =>
                                                setData('notes', e.target.value)
                                            }
                                            placeholder="Thêm ghi chú về liên hệ này..."
                                            rows={4}
                                        />
                                        {errors.notes && (
                                            <p className="text-sm text-destructive">
                                                {errors.notes}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={`/contacts/${contact.id}`}>
                                        Hủy
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing
                                        ? 'Đang cập nhật...'
                                        : 'Cập nhật'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
