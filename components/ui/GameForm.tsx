"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGame } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, Gamepad2, Loader2, CheckCircle } from 'lucide-react';
import { formSchema, GAME_CATEGORIES } from '@/lib/validation';
import { debounce } from '@/lib/utils';

interface FormData {
  title: string;
  description: string;
  category: string;
  image: string;
  gameUrl: string;
}

export default function GameForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    image: '',
    gameUrl: ''
  });
  const router = useRouter();

  // Debounced validation
  const validateField = debounce((name: string, value: string) => {
    try {
      const fieldSchema = formSchema.shape[name as keyof typeof formSchema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  }, 300);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate entire form
      const validatedData = formSchema.parse(formData);
      
      // Create FormData object to match the server action signature
      const form = new FormData();
      form.append('title', validatedData.title);
      form.append('description', validatedData.description);
      form.append('category', validatedData.category);
      form.append('image', validatedData.image);
      form.append('gameUrl', validatedData.gameUrl);

      const result = await createGame({}, form, '');
      
      if (result.status === 'SUCCESS') {
        toast.success('Game uploaded successfully!', {
          description: 'Your game is now live on the platform.',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />
        });
        router.push('/');
      } else {
        throw new Error(result.error || 'Failed to upload game');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('validation')) {
        // Handle validation errors
        const validationErrors: Record<string, string> = {};
        error.message.split(',').forEach(err => {
          const [field, message] = err.split(':').map(s => s.trim());
          if (field && message) {
            validationErrors[field] = message;
          }
        });
        setErrors(validationErrors);
        toast.error('Please fix the validation errors');
      } else {
        toast.error('Failed to upload game', {
          description: error instanceof Error ? error.message : 'Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Validate field
    validateField(name, value);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Upload Your Game</h1>
              <p className="text-primary-100 text-sm">Share your creation with the community</p>
            </div>
          </div>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
              Game Title *
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter your game title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={`h-12 px-4 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl ${
                errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <p id="title-error" className="text-sm text-red-600 mt-1">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
              Description *
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your game, its features, and what makes it special..."
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className={`px-4 py-3 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl resize-none ${
                errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-sm text-red-600 mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className={`w-full h-12 px-4 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-primary-500 bg-white ${
                errors.category ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              aria-describedby={errors.category ? 'category-error' : undefined}
            >
              <option value="">Select a category</option>
              {GAME_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p id="category-error" className="text-sm text-red-600 mt-1">
                {errors.category}
              </p>
            )}
          </div>

          {/* Game URL */}
          <div className="space-y-2">
            <label htmlFor="gameUrl" className="block text-sm font-semibold text-gray-700">
              Game URL *
            </label>
            <Input
              id="gameUrl"
              name="gameUrl"
              type="url"
              placeholder="https://yourgame.com or itch.io link"
              value={formData.gameUrl}
              onChange={handleInputChange}
              required
              className={`h-12 px-4 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl ${
                errors.gameUrl ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              aria-describedby={errors.gameUrl ? 'gameUrl-error' : undefined}
            />
            {errors.gameUrl && (
              <p id="gameUrl-error" className="text-sm text-red-600 mt-1">
                {errors.gameUrl}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700">
              Game Image URL *
            </label>
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/game-image.jpg"
              value={formData.image}
              onChange={handleInputChange}
              required
              className={`h-12 px-4 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl ${
                errors.image ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              aria-describedby={errors.image ? 'image-error' : undefined}
            />
            <p className="text-xs text-gray-500">
              Provide a direct link to your game&apos;s image (JPG, PNG, or GIF)
            </p>
            {errors.image && (
              <p id="image-error" className="text-sm text-red-600 mt-1">
                {errors.image}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                  Uploading Game...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" aria-hidden="true" />
                  Upload Game
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
