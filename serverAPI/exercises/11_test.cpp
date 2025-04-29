#include <gtest/gtest.h>
#include <fstream>
#include <cstdlib>

TEST(BuscaVetorTest, Encontrado)
{
    system("echo '1 2 3 4 5 6 7 8 9 10\n7' | ./code_exec > saida.txt");
    std::ifstream saida("saida.txt");
    std::string linha;
    while (std::getline(saida, linha))
    {
        if (linha == "Encontrado")
            break;
    }
    EXPECT_EQ(linha, "Encontrado");
}

int main(int argc, char **argv)
{
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
